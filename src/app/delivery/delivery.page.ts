import { Component} from '@angular/core';
import { AppComponent} from '../app.component';

let pdfMake = require('pdfmake/build/pdfmake.js');
let pdfFonts = require('pdfmake/build/vfs_fonts.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import {Camera, CameraOptions} from '@awesome-cordova-plugins/camera/ngx';
import {ActionSheetController} from '@ionic/angular';
import {HTTP} from '@awesome-cordova-plugins/http/ngx';
//import {ActionPerformed,PushNotificationSchema,PushNotifications,Token} from '@capacitor/push-notifications';
import Swal from 'sweetalert2';
import * as $ from "jquery";

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.page.html',
  styleUrls: ['./delivery.page.scss'],
})
export class DeliveryPage  {

  
  BaseUrl = this.Link.BaseLink(); 
  constructor(private http: HTTP, private Link: AppComponent, private camera: Camera, private actionSheetCtrl: ActionSheetController) {  }

  DataHome: any;
  clickedImage: any;
  imageContent: any;

  MemberPDFServer: any[] = [];
 

//VALIDATIONS

CheckTracknumber(event: FocusEvent) {
  var Phone = (<HTMLInputElement>document.getElementById('track_number')).value;
  var PhoneLength = Phone?.length;
  if (!PhoneLength || PhoneLength !== 10) {
    Swal.fire({ title: 'Error', icon: 'error', text: 'The phone provided is longer or shorter than 10 characters, please try again', heightAuto: false });
    (<HTMLInputElement>document.getElementById('track_number')).value = '';
  }
}

//CAMARA


  FromCamera() {

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetWidth: 1400,
      targetHeight: 600
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.imageContent = imageData;
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.clickedImage = base64Image;
    }, (err) => {
      console.log(err);
      // Handle error
    });
  }

  FromGallery() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      correctOrientation: true,
      targetWidth: 1400,
      targetHeight: 600
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.imageContent = imageData;
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.clickedImage = base64Image;
    }, (err) => {
      console.log(err);
      // Handle error
    });
  }

   async PictureOptions() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Take photo from:',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.FromCamera();
          }
        },
        {
          text: 'Gallery',
          icon: 'folder',
          handler: () => {
            this.FromGallery();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();
  }
//Photo and basic data
SaveInfoDeliver(){

    $('#Preloader').show();
    $('#PhotoButtonPhoto').attr('disabled','disabled');
    $('#SaveMembutton').attr('disabled','disabled');
    var Photo = this.imageContent;
    var name = $('#name_m').val();
    var lastname = $('#lastname_m').val();
    var phone = $('#phone_m').val();
    var email = $('#email_m').val();
    var status = $('#status').val();


    const data = {
      Photo:Photo,
      name:name,
      lastname:lastname,
      phone:phone,
      email:email,
      status:status
    };

    const headers = {
      'Content-Type' : 'application/x-www-form-urlencoded'
    }

    if(Photo!=undefined && name!="" && lastname!="" && phone!="" && email!=""){
      this.http.post(this.BaseUrl+'index.php/Members/SaveMemberALL', data, headers).then((response) =>{

        $('#Preloader').hide();
        $('#PhotoButtonPhoto').removeAttr('disabled');
        $('#SaveMembutton').removeAttr('disabled');
        $('#Photo').attr('src',"");
        $('#name_m').val("");
        $('#lastname_m').val("");
        $('#email_m').val("");
        $('#phone_m').val("");

        var Response = response.data;
        var Object = JSON.parse(response.data);

      if(Object != ""){
        this.MemberPDFServer = JSON.parse(response.data);
      }else{
        this.MemberPDFServer = JSON.parse(response.data);
        Swal.fire({title:'Error', icon:'error', text: 'There is no info for the date selected',heightAuto:false});
      }

  
        
        Swal.fire({title:'Success', icon:'success', text: 'Data has been saved successfully',heightAuto:false});
        Swal.fire({title:'Success', icon:'success', text: 'La foto fue realizado exitosamente',heightAuto:false});
      }).catch(error => {

        $('#Preloader').hide();
        $('#PhotoButtonPhoto').removeAttr('disabled');
        $('#SaveMembutton').removeAttr('disabled');
        $('#Photo').attr('src',"");


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
            $("#SaveMembutton").removeAttr('disabled');

            } 
          });
        }else{
          $("#Preloader").hide();
          $("#SaveMembutton").removeAttr('disabled');
          Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
        }

      });
    }else{
      $("#Preloader").hide();
      $('#PhotoButtonPhoto').removeAttr('disabled');
      $("#SaveMembutton").removeAttr('disabled');
      Swal.fire({title:'Warning', icon:'warning', text: 'There is missing info on the form',heightAuto:false});
    }

    
    
  }

  

  ngOnInit() {
  }

}
