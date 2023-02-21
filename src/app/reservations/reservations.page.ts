import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import * as $ from "jquery";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
})
export class ReservationsPage implements OnInit {

  BaseUrl = this.Link.BaseLink();
  constructor(private http: HTTP, private Link: AppComponent) { }

  ReservationObj :any; 
  ReserPDFServer :any;
//V A L I D A T I O N S

CheckDestinationText1(){
  let Comments: any = $("#CommentsDataPDF").val();
  let CommentsNospace: any = Comments.trim();
  let CommentsLength: any = CommentsNospace.length;

  if(CommentsLength<15){
    Swal.fire({title: 'Warning', icon:'warning', text: 'This field must be at least 30 characters long',heightAuto: false});
  $("#ButtonReservationPDF").attr('disabled','disabled');
  
}else{
  $("#ButtonReservationPDF").removeAttr('disabled');
}
}


CheckPhoneReservation(event: FocusEvent) {
var Phone = (<HTMLInputElement>document.getElementById('phone_reservation')).value;
var PhoneLength = Phone?.length;
if (!PhoneLength || PhoneLength !== 10) {
  Swal.fire({ title: 'Error', icon: 'error', text: 'The phone provided is longer or shorter than 10 characters, please try again', heightAuto: false });
  (<HTMLInputElement>document.getElementById('phone_reservation')).value = '';
}
}



  //C R U D
  SaveReservationPDF(){
    $("#Preloader").show();
    $("#ButtonReservationPDF").attr('disabled', 'disabled');
  
    var Name_r = $("#name_reservation").val();
    var LastName_r = $("#lastname_reservation").val();
    var Phone_r = $("#phone_reservation").val();
    var Driver_r = $("#DraverData").val();
    var Destination_r = $("#DestinationDataPDF").val();
    var Comments_r = $("#CommentsDataPDF").val();

    const data= {
      Name_r:Name_r,
      LastName_r:LastName_r,
      Phone_r:Phone_r,
      Driver_r:Driver_r,
      Destination_r:Destination_r,
      Comments_r:Comments_r

    }
   
  
    const headers= {
  
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  
    if(Name_r!="" && LastName_r !="" && Phone_r !=""&& Destination_r!= "" && Comments_r!= "" && Driver_r!= ""){
  
      this.http.post(this.BaseUrl+'index.php/Dashboard/SaveReservationPDF', data, headers).then((response)=> {
  
        $("#Preloader").hide();
        $("#ButtonReservationPDF").removeAttr('disabled');
  
        $("#name_reservation").val('');
        $("#lastname_reservation").val('');
        $("#phone_reservation").val('');
        $("#DraverData").val("");
        $("#DestinationDataPDF").val('');
        $("#CommentsDataPDF").val('');
       
  
        Swal.fire({title: 'Success', icon: 'success', text: 'Data has been saved successfully', heightAuto:false})
      }).catch(error => {
  
        console.log(error.status);
        console.log(error.error); //Mensaje de error en una cadena.
        console.log(error.headers);
  
        if (error.status == "timeout"){
  
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
            $("#ButtonReservationPDF").removeAttr('disabled');

            } 
          });
  
            
        }else{
          $("#Preloader").hide();
          $("#ButtonReservationPDF").removeAttr('disabled');
          Swal.fire({title: 'Error', icon: 'error',text: 'An internal server error has occurred please contact ',heightAuto:false})
        }
          });
  
        }else{
          $("#Preloader").hide();
          $("#ButtonReservationPDF").removeAttr('disabled');
          Swal.fire({title: 'Warning', icon: 'warning',text: 'There is missing info on the form', heightAuto: false});
        }
  

      }


ngOnInit() {
      
  }


}