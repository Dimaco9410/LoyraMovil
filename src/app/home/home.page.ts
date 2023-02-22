import { Component, OnInit } from '@angular/core';
import { AppComponent} from '../app.component';
import {ActionSheetController} from '@ionic/angular';
import {HTTP} from '@awesome-cordova-plugins/http/ngx';
import Swal from 'sweetalert2';
import * as $ from "jquery";




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

  export class HomePage {

    
      BaseUrl = this.Link.BaseLink();
      constructor(private http: HTTP, private Link: AppComponent, private actionSheetCtrl: ActionSheetController) {
        this.DeliveryList();
       }

      TripsServer : any;
      
      DeliveryList(){

        const data ={
         
            
        };
      
        const headers = {
          'Content-Type' : 'application/x-www-form-urlencoded'
        }
      
            this.http.get(this.BaseUrl+'index.php/Trips/TripsPerDay', data, headers).then((response) =>{
              
              console.log(response.data)
              this.TripsServer =  JSON.parse(response.data);
              //console.log(this.MemberPDFServer);
               
            }).catch(error => {
              
              console.log(error.status);
              console.log(error.error);// Mensaje de eeror en una cadena.
              console.log(error.headers);
            
      
              if (error.status=="timeout") {
      
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
      
                  } 
                });
              }else{
                Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
              }
      
            });
      
        } 
    
      ngOnInit() {
      }
    
    }
