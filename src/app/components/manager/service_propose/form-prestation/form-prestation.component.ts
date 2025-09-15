import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PrestationService, Prestation, Piece, TypeVehicule } from '../../../../services/manager/service_propose/prestation.service';

@Component({
  selector: 'app-form-prestation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-prestation.component.html',
  styleUrl: './form-prestation.component.css'
})
export class FormPrestationComponent implements OnInit {
  prestationForm: FormGroup;
  pieces: Piece[] = [];
  typesVehicule: TypeVehicule[] = [];
  isEditMode = false;
  prestationId: string | null = null;
  loading = false;
  submitLoading = false;

  constructor(
    private fb: FormBuilder,
    private prestationService: PrestationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.prestationForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadFormData();

    // Vérifier si on est en mode édition
    this.prestationId = this.route.snapshot.paramMap.get('id');
    if (this.prestationId) {
      this.isEditMode = true;
      this.loadPrestation();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      prix_main_oeuvre: [0, [Validators.required, Validators.min(0)]],
      supplementMainOeuvre: this.fb.array([]),
      processus: this.fb.array([])
    });
  }

  // Charger les données nécessaires pour le formulaire
  loadFormData(): void {
    this.loading = true;

    // Charger pièces et types véhicule en parallèle
    Promise.all([
      this.prestationService.getPieces().toPromise(),
      this.prestationService.getTypesVehicule().toPromise()
    ]).then(([piecesResponse, typesResponse]) => {
      this.pieces = piecesResponse?.pieces || [];
      this.typesVehicule = typesResponse?.typesVehicule || [];
      this.loading = false;
    }).catch(error => {
      console.error('Erreur lors du chargement:', error);
      this.loading = false;
    });
  }

  // Charger une prestation existante pour modification
  loadPrestation(): void {
    if (!this.prestationId) return;

    this.prestationService.getPrestationById(this.prestationId).subscribe({
      next: (prestation) => {
        this.prestationForm.patchValue({
          nom: prestation.nom,
          description: prestation.description,
          prix_main_oeuvre: prestation.prix_main_oeuvre
        });

        // Charger les suppléments
        if (prestation.supplementMainOeuvre) {
          prestation.supplementMainOeuvre.forEach(supplement => {
            this.addSupplement(supplement);
          });
        }

        // Charger le processus
        if (prestation.processus) {
          prestation.processus.forEach(etape => {
            this.addProcessusEtape(etape);
          });
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la prestation:', error);
        alert('Erreur lors du chargement de la prestation');
        this.goBack();
      }
    });
  }

  // Getters pour les FormArrays
  get supplementMainOeuvre(): FormArray {
    return this.prestationForm.get('supplementMainOeuvre') as FormArray;
  }

  get processus(): FormArray {
    return this.prestationForm.get('processus') as FormArray;
  }

  // Gestion des suppléments main d'œuvre
  createSupplementForm(supplement?: any): FormGroup {
    return this.fb.group({
      typeVehicule: [supplement?.typeVehicule?._id || supplement?.typeVehicule || '', Validators.required],
      supplement: [supplement?.supplement || 0, [Validators.required, Validators.min(0)]]
    });
  }

  addSupplement(supplement?: any): void {
    this.supplementMainOeuvre.push(this.createSupplementForm(supplement));
  }

  removeSupplement(index: number): void {
    this.supplementMainOeuvre.removeAt(index);
  }

  // Gestion du processus
  createProcessusForm(etape?: any): FormGroup {
    return this.fb.group({
      ordre: [etape?.ordre || this.processus.length + 1, [Validators.required, Validators.min(1)]],
      nom_etape: [etape?.nom_etape || '', [Validators.required, Validators.minLength(3)]],
      pieces_possibles: [etape?.pieces_possibles?.map((p: any) => typeof p === 'object' ? p._id : p) || []]
    });
  }

  addProcessusEtape(etape?: any): void {
    this.processus.push(this.createProcessusForm(etape));
  }

  removeProcessusEtape(index: number): void {
    this.processus.removeAt(index);
    // Réorganiser les ordres
    this.processus.controls.forEach((control, i) => {
      control.get('ordre')?.setValue(i + 1);
    });
  }

  // Gestion de la soumission
  onSubmit(): void {
    if (this.prestationForm.invalid) {
      this.markFormGroupTouched(this.prestationForm);
      return;
    }

    this.submitLoading = true;
    const formData = this.prestationForm.value;

    // Nettoyer les données avant envoi
    const prestationData: Prestation = {
      nom: formData.nom.trim(),
      description: formData.description.trim(),
      prix_main_oeuvre: Number(formData.prix_main_oeuvre),
      supplementMainOeuvre: formData.supplementMainOeuvre.filter((s: any) => s.typeVehicule && s.supplement >= 0),
      processus: formData.processus.map((p: any, index: number) => ({
        ordre: index + 1,
        nom_etape: p.nom_etape.trim(),
        pieces_possibles: p.pieces_possibles.filter((id: string) => id)
      }))
    };

    const operation = this.isEditMode
      ? this.prestationService.updatePrestation(this.prestationId!, prestationData)
      : this.prestationService.createPrestation(prestationData);

    operation.subscribe({
      next: (response) => {
        alert(response.message);
        this.goBack();
      },
      error: (error) => {
        console.error('Erreur lors de la sauvegarde:', error);
        alert('Erreur lors de la sauvegarde de la prestation');
        this.submitLoading = false;
      }
    });
  }

  // Marquer tous les champs comme touchés pour afficher les erreurs
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(c => {
          if (c instanceof FormGroup) {
            this.markFormGroupTouched(c);
          }
        });
      }
    });
  }

  // Utilitaires
  getTypeVehiculeNom(id: string): string {
    const type = this.typesVehicule.find(t => t._id === id);
    return type ? type.nom : '';
  }

  getPieceNom(id: string): string {
    const piece = this.pieces.find(p => p._id === id);
    return piece ? piece.nom : '';
  }

  // Formatage prix
  formatPrice(price: number): string {
    return new Intl.NumberFormat('mg-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  // Navigation corrigée - navigation relative pour rester dans le layout
  goBack(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  // Validation helpers
  hasError(controlName: string): boolean {
    const control = this.prestationForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.prestationForm.get(controlName);
    if (control && control.errors) {
      if (control.errors['required']) return 'Ce champ est requis';
      if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
      if (control.errors['min']) return 'La valeur doit être positive';
    }
    return '';
  }
}
