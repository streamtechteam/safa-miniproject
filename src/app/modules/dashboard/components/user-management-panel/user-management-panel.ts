import { AfterViewInit, Component, inject, Signal, viewChild, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HttpClientService } from '../../services/http-client';
import { User } from '../../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddFormComponent } from './add-form/add-form';
import { MatIcon } from '@angular/material/icon';
import { EditFormComponent } from './edit-form/edit-form';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';

@Component({
  selector: 'app-user-management-panel',
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
  templateUrl: './user-management-panel.html',
  styleUrl: './user-management-panel.scss',
})
export class UserManagementPanelComponent implements AfterViewInit {
  private httpClientService: HttpClientService = inject(HttpClientService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'username', 'password', 'action'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  searchField: FormControl<string> = new FormControl<string>('', { nonNullable: true });
  paginator = viewChild.required(MatPaginator);

  editDialog = {
    enabled: false,
    id: '',
  };
  addDialog = false;

  ngAfterViewInit() {
    this.updateDataSource();
    setInterval(() => {
      this.updateDataSource();
    }, 1000);
  }

  updateDataSource() {
    this.httpClientService.getUsers().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator();
      this.applyFilter(this.searchField.getRawValue());
    });
  }
  deleteUser(id: string) {
    const snackBarRef = this.snackBar.open('آیا از حذف این کاربر اطمینان دارید ؟', 'تایید');
    snackBarRef.onAction().subscribe(() => {
      this.httpClientService.removeUser(id).subscribe(() => {
        this.snackBar.open('کاربر با موفقیت حذف شد.', undefined, { duration: 3000 });
      });
    });
  }
  editUser(id: string) {
    this.addDialog = false;
    this.editDialog.enabled = true;
    this.editDialog.id = id;
  }

  applyFilter(query: string) {
    this.dataSource.filter = query.trim().toLowerCase();
  }
}
