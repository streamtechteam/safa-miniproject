import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

export interface ManagementPanel<DataType> {
  displayedColumns: string[];
  dataSource: MatTableDataSource<DataType>;
  searchField: FormControl<string>;
  editDialog: { enabled: boolean; id: string };
  addDialog: boolean;
  updateDataSource(): void;
  applyFilter(query: string): void;
}
