import { MiaPagination, MiaQuery } from '@agencycoda/mia-core';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MiaColumn, MiaTableConfig, MiaTableEditableComponent, MiaTableEditableConfig } from '@agencycoda/mia-table';
import { MiaFormModalConfig, MiaFormConfig, MiaFormModalComponent, MiaField} from '@agencycoda/mia-form';
import { ClientService } from './services/client.service';
import { Validators } from '@angular/forms';
import { Client } from './entities/client';
import { MiaTableComponent } from '@agencycoda/mia-table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'coda-test-angular';

  @ViewChild('tableComp') tableComp!: MiaTableComponent;

  tableConfig: MiaTableConfig = new MiaTableConfig();

  nuevoCliente: Client = new Client();

  tableEditableConfig: MiaTableEditableConfig = new MiaTableEditableConfig();
  tableDataEditable: Array<any> = [];

  queryScroll = new MiaQuery();

  constructor(
    public modalEditar: MatDialog,
    public modalConfirmacion: MatDialog,
    public testService: ClientService
  ){
    
  }

  ngOnInit(): void {
    this.loadConfig();

    this.queryScroll.itemPerPage = 1;
  }

  loadConfig() {
    this.tableConfig.service = this.testService;
    this.tableConfig.id = 'table-test';
    //Solo se dejan las columnas Nombres, Apellido, Email y Acciones
    this.tableConfig.columns = [
      { key: 'firstname', type: 'string', title: 'Nombre', field_key: 'firstname', extra: { conditional_field: 'status' } },
      { key: 'lastname', type: 'string', title: 'Apellido', field_key: 'lastname', extra: { conditional_field: 'status' } },
      { key: 'email', type: 'string', title: 'Email', field_key: 'email', extra: { conditional_field: 'status' } },
      { key: 'more', type: 'more', title: '', extra: {
        actions: [
          { icon: 'create', title: 'Editar', key: 'edit' },
          { icon: 'delete', title: 'Borrar', key: 'remove' },
        ]
      } }
    ];

    this.tableConfig.loadingColor = 'black';
    this.tableConfig.hasEmptyScreen = true;
    this.tableConfig.emptyScreenTitle = 'No tenes cargado ningun elemento todavia';

    this.tableConfig.onClick.subscribe(result => {
      if(result.key=='edit')//Si el boton apretado es editar llamo a la funcion abrirModal
        this.abrirModal(result.item);
      if(result.key=='remove')//si el boton apretado es Eliminar
      {
        const dialogRef = this.modalConfirmacion.open(ModalConfirmComponent,{//Llamo al modal de confirmacion
          width: '300px',
        });
        
        dialogRef.afterClosed().subscribe(dialogResult =>{
          if(dialogResult){//Si del modal vuelve true es porque hay que eliminar el item con el Id indicado
            this.testService.remove(result.item["id"]).then(()=>{
            this.tableComp.loadItems();//Carga los items en la tablla
            });
          }
        });
      }
    });
  }

  abrirModal(item: any){
    let data = new MiaFormModalConfig();
    data.item = item;//Le asigno el Item
    data.service = this.testService;
    data.titleNew = 'Crear Cliente';
    data.titleEdit = 'Editar Cliente';
    let config = new MiaFormConfig();
    config.hasSubmit = false;
    config.fields = [
    { key: 'firstname', type: MiaField.TYPE_STRING, label: 'Nombre' },
    { key: 'lastname', type: MiaField.TYPE_STRING, label: 'Apellido' },
    { key: 'email', type: MiaField.TYPE_STRING, label: 'Email', validators:
    [Validators.required] },//El Email es requerido
    ];
    config.errorMessages = [
    { key: 'required', message: 'El "%label%" es requerido.' }
    ];
    data.config = config;
    return this.modalEditar.open(MiaFormModalComponent, {//Llamo al modal para Editar o Crear
    width: '520px',
    panelClass: 'modal-full-width-mobile',
    data: data
    }).afterClosed();
  }

  crearCliente(){//Si apreto el boton de Nuevo Cliente abro el modal pasandole un cliente vacio
    this.nuevoCliente= new Client();
    this.abrirModal(this.nuevoCliente).subscribe(()=>{
      this.tableComp.loadItems();//Vuelve a cargar los items de la tabla
    });
  }
}
