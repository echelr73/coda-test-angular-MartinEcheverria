import { Component, OnInit } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent implements OnInit {

  constructor(
    public modalConfirmacion: MatDialogRef<ModalConfirmComponent>
  ) { }

  ngOnInit(): void {
  }

  onConfirm(): void {
    //Si confirman la eliminacion devuelve true
    this.modalConfirmacion.close(true);
  }

  onDismiss(): void {
    //Si no quieren eliminarlo devuelve false
    this.modalConfirmacion.close(false);
  }

}
