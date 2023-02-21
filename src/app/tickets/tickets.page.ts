import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
let pdfMake = require('pdfmake/build/pdfmake.js');
let pdfFonts = require('pdfmake/build/vfs_fonts.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import * as $ from "jquery";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})
export class TicketsPage implements OnInit {

  pdfObj :any;
  ReserPDFServer :any;

  BaseUrl = this.Link.BaseLink();
  DateFormat = new Date().toISOString().substring(0, 10);

  constructor(private http: HTTP, private Link: AppComponent,private file: File, private fileOpener: FileOpener) {  }


  GetTicketPDF(){
    $("#Preloader").show();
    $("#ButtonTicketPDF").attr('disabled', 'disabled');

    var DateTicketPDF = $("#DateTicketPDF").val();
    if(DateTicketPDF!=""){

      const data = {
        DateTicketPDF:DateTicketPDF
      };
  
      const headers = {
        'Content-Type' : 'application/x-www-form-urlencoded'
      }

      this.http.post(this.BaseUrl+'index.php/Dashboard/GetTicketPDF', data, headers).then((response) =>{

        $('#Preloader').hide();
        $('#ButtonTicketPDF').removeAttr('disabled');
        
        var Object = JSON.parse(response.data);

        if(Object != ""){
          this.ReserPDFServer = JSON.parse(response.data);
        }else{
          this.ReserPDFServer = JSON.parse(response.data);
          Swal.fire({title:'Error', icon:'error', text: 'There is no info for the date selected',heightAuto:false});
        }

      }).catch(error => {
        
        console.log(error.status);
        console.log(error.error);// Mensaje de eeror en una cadena.
        console.log(error.headers);


        if (error.status="timeout") {

          Swal.fire({   
            title: 'Error',
            text: 'Your device is not connected to internet or your connection is very slow.\n Please try again' ,   
            icon: 'error',   
            heightAuto:false,
            allowOutsideClick: false,
            showCancelButton: false,   
            confirmButtonColor: "#DD6B55",   
            confirmButtonText: "OK",   
            cancelButtonText: "No, Cancelar",   
          }).then((result) => {
        if (result.value) {
            $("#Preloader").hide();
            $("#ButtonTicketPDF").removeAttr('disabled');

            } 
          });
        }else{
          $("#Preloader").hide();
          $("#ButtonTicketPDF").removeAttr('disabled');
          Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
        }

      });
    }else{
      $("#Preloader").hide();
      $("#ButtonTicketPDF").removeAttr('disabled');
      Swal.fire({title:'Warning', icon:'warning', text: 'There is missing info on the form',heightAuto:false});
    }
  }

  GenerateTicketPDF(PDFTICKETId: any){

    $("#Preloader").show();

    var PDFTICKETId = PDFTICKETId;

    if(PDFTICKETId!=""){

      const data = {
        PDFTICKETId:PDFTICKETId
      };
  
      const headers = {
        'Content-Type' : 'application/x-www-form-urlencoded'
      }

      this.http.post(this.BaseUrl+'index.php/Dashboard/GetTICKETpdfID', data, headers).then((response) =>{

        $('#Preloader').hide();
        
        var Object = JSON.parse(response.data);


        var Name_r = Object[0].name_c;
        var LastName_r = Object[0].last_name_c;
        var Phone_r = Object[0].phone_c;
        var DateTicketPDF = Object[0].date;
        var Destination_r = Object[0].destination_rese;
        var Comments_r = Object[0].comments_p;
        var Driver_r = Object[0].driver_c;
        

        var docDefinition = {
          //Inicio del contenido PDF
          content: [
            {
              text: 'Customer name: ' +Name_r+ '  '+LastName_r+' Destination: ' +Destination_r ,style:'header',alignment:'center'
            },
            {
              text: 'Customer phone: ' +Phone_r+ ', Chofer: ' +Driver_r ,style:'header',alignment:'center'
            },

            {
              text: '\t\t\t\t\t\t\t\t\t\t\t\t', style:'negro',alignment:'center'
            },

            {
              text: '\t\t\t\t\t\t\t\t\t\t\t\t', style:'negro',alignment:'center'
            },

            {
              text: 'Printed: : ' +DateTicketPDF, style:'negro',alignment:'right'
            },

            {
              text: 'Pick up comments: ' +Comments_r, style:'negro',alignment:'right'
            },

           

            {
              text: '\t\t\t\t\t\t\t\t\t\t\t\t', style:'negro',alignment:'center'
            },

            {
              text: '\t\t\t\t\t\t\t\t\t\t\t\t', style:'negro',alignment:'center'
            },

            {
              text: '\t\t\t\t\t\t\t\t\t\t\t\t', style:'negro',alignment:'center'
            },

            {
              text: '\t\t\t\t\t\t\t\t\t\t\t\t', style:'negro',alignment:'center'
            },

            {
              text: '\t\t\t\t\t\t\t\t\t\t\t\t', style:'negro',alignment:'center'
            },

            {
              text: '\t\t\t\t\t\t\t\t\t\t\t\t', style:'negro',alignment:'center'
            },

            {
              text: '\t\t\t\t\t\t\t\t\t\t\t\t', style:'negro',alignment:'center'
            },

          ], //Termina contenido del PDF

          //Inician estilos del PDF

          styles: {
            header:{
              fontSize: 16,
              bold: true
            },

            negro:{
              bold: true,
              fontSize: 8
            },
          },
          //Terminan los estilos PDF

        };

        var DocName = "PDF from " +Name_r+".pdf";
        this.pdfObj = pdfMake.createPdf(docDefinition); //Abre el pdf en el navegador
          //alert(pdfObj); 

        this.pdfObj.getBuffer((buffer: any) =>{
          var blob = new Blob([buffer], {type: 'application/pdf'});

          //alert(blob);

          //Save the PDF to the data Directory of our App
          this.file.writeFile(this.file.dataDirectory, DocName, blob, {replace: true}).then(fileEntry=> {
          //Open the PDF with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + DocName, 'application/pdf');
          })
        });

      }).catch(error => {
        
        console.log(error.status);
        console.log(error.error);// Mensaje de eeror en una cadena.
        console.log(error.headers);


        if (error.status="timeout") {

          Swal.fire({   
            title: 'Error',
            text: 'Your device is not connected to internet or your connection is very slow.\n Please try again' ,   
            icon: 'error',   
            heightAuto:false,
            allowOutsideClick: false,
            showCancelButton: false,   
            confirmButtonColor: "#DD6B55",   
            confirmButtonText: "OK",   
            cancelButtonText: "No, Cancelar",   
          }).then((result) => {
        if (result.value) {
            $("#Preloader").hide();

            } 
          });
        }else{
          $("#Preloader").hide();

          Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
        }

      });
    }
  }
  ngOnInit() {
  }

}

