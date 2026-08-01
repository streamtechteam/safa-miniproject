import { AfterViewInit, Component, inject, Signal, viewChild, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Vehicle } from '../../models/fleet';
import { EditFormComponent } from './edit-form/edit-form';
import { AddFormComponent } from './add-form/add-form';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FleetService } from '../../services/fleet.service';
import { interval, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-fleet-management-panel',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    EditFormComponent,
    MatIcon,
    AddFormComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './fleet-management-panel.html',
  styleUrl: './fleet-management-panel.scss',
})
export class FleetManagementPanelComponent {
  private fleetService = inject(FleetService);
  private snackBar = inject(MatSnackBar);
  displayedColumns: string[] = ['id', 'plate', 'organization', 'type', 'usage', 'state', 'action'];
  dataSource: MatTableDataSource<Vehicle> = new MatTableDataSource<Vehicle>([]);
  searchField: FormControl<string> = new FormControl<string>('', { nonNullable: true });

  editDialog = {
    enabled: false,
    id: '',
  };
  addDialog = false;

  readonly paginator: Signal<MatPaginator> = viewChild.required(MatPaginator);

  updateDataSource() {
    this.fleetService.getFleet().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator();
      this.applyFilter(this.searchField.getRawValue());
    });
  }
  constructor() {
    this.updateDataSource();
    interval(2000)
      .pipe(startWith(0), takeUntilDestroyed())
      .subscribe(() => {
        this.updateDataSource();
      });
  }

  deleteVehicle(id: string) {
    const snackBarRef = this.snackBar.open('آیا از حذف این خودرو اطمینان دارید ؟', 'تایید');
    snackBarRef.onAction().subscribe(() => {
      this.fleetService.removeVehicle(id).subscribe(() => {
        this.snackBar.open('خودرو با موفقیت حذف شد.', undefined, { duration: 2000 });
      });
    });
  }
  editVehicle(id: string) {
    this.addDialog = false;
    this.editDialog.enabled = true;
    this.editDialog.id = id;
  }

  applyFilter(query: string) {
    this.dataSource.filter = query.trim().toLowerCase();
  }
}
