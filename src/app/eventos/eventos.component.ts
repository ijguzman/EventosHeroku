import { Component, OnInit, NgModule } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { DtoService } from '../servicios';
import * as moment from 'moment';
@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  constructor(private dto: DtoService) { 
    this.buscar=false;
    this.busqueda_todos=false;
    this.busqueda_uno=false;
  }
  private Evento:any={};
  private eventos:any={};
  private evento:any;
  private CodigoEvento:any;
  private buscar:any;
  private busqueda_todos:any;
  private busqueda_uno:any;
  ngOnInit() {
    
  }
  buscarEvento(){
    this.buscar=true;
    // alert(this.CodigoEvento);
    if(this.CodigoEvento==""||this.CodigoEvento==undefined){
      // alert("TODOS");
      this.busqueda_todos=true;
      this.busqueda_uno=false;
    }
    else{
      // alert("NO TODOS");
      this.busqueda_uno=true;
      this.busqueda_todos=false;
    }
    this.obtenerEvento(this.CodigoEvento).subscribe(
      (resp:any)=>{
         
          console.log(resp);
          
          this.eventos=resp;
          if(this.CodigoEvento==""||this.CodigoEvento==undefined){
              for(var i=0;i<this.eventos.length;i++){
                this.eventos[i].timestamp=this.convertirFecha(this.eventos[i].timestamp);
              }
          }else{
            this.eventos.timestamp=this.convertirFecha(this.eventos.timestamp);
          }
          console.log(this.eventos.name);    
      },
      (error)=>{

      }

    );
  }
  
  convertirFecha(fecha){
    return new Date(parseInt(fecha)*1000).toLocaleDateString();
  }
  eliminarEvento(reg: any) {
    alert(reg);
    this.borrarEvento(reg.code).subscribe(
     (resp:any)=>
     {
       console.log(resp);
       location.reload();
     }
    ) ;
  }
  editarEvento(reg: any) {
    this.Evento = reg;
    this.Evento.timestamp=this.formatoFecha(this.Evento.timestamp);
  }
  formatoFecha(fecha){
    var fecha_dividida=fecha.split("/");
    return moment(new Date(parseInt(fecha_dividida[2]),parseInt(fecha_dividida[1]),parseInt(fecha_dividida[0]) )).format("YYYY-MM-DD");   
  }
  guardarEvento(){
    console.log(this.Evento);
    var fecha=new Date(this.Evento.timestamp);
    this.Evento.timestamp=(fecha.getTime()/1000)+(3600*24);
    if (this.Evento._id) {
      console.log("Actualizar "+this.Evento.timestamp);
      this.Evento.id=undefined;
      this.actualizarEvento(this.Evento).subscribe(
        (resp: any) => {
          console.log(resp);
          alert("Actualización correcta");
        }

      )

    }else{
      //this.Evento.curso="10";
      console.log("Insertar");
      this.insertarEvento(this.Evento).subscribe(
        (resp:any)=>{
          console.log(resp);
          alert("Inserción correcta");
        }
      );
    }
    location.reload();
  }
  
  
  //SERVICIOS
  obtenerEvento(evento)
  {
    if(evento==""||evento==undefined){
      return this.dto.ejecutaGet("https://thawing-ridge-42680.herokuapp.com/event/");
    }else{
      return this.dto.ejecutaGet("https://thawing-ridge-42680.herokuapp.com/event/"+evento);
    }
  }
  insertarEvento(nuevo){
    return this.dto.ejecutaPut("https://thawing-ridge-42680.herokuapp.com/event/new/",nuevo);
  }
  borrarEvento(codigo){
    return this.dto.ejecutaDelete2("https://thawing-ridge-42680.herokuapp.com/event/delete/"+codigo);
  }
  actualizarEvento(data)
  {
    console.log("Post");
    return this.dto.ejecutaPost("https://thawing-ridge-42680.herokuapp.com/event/update/",data);
  }

}
