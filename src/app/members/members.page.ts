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
  selector: 'app-members',
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
})
export class MembersPage  {

  
  BaseUrl = this.Link.BaseLink(); 

  constructor(private http: HTTP, private Link: AppComponent, private camera: Camera, private actionSheetCtrl: ActionSheetController) {  
  
    this.MemberList();
  }

 
  DataHome: any;
  clickedImage: any;
  imageContent: any;

  MemberPDFServer : any;

//VALIDATIONS

CheckPhoneMembers(event: FocusEvent) {
  var Phone = (<HTMLInputElement>document.getElementById('phone_m')).value;
  var PhoneLength = Phone?.length;
  if (!PhoneLength || PhoneLength !== 10) {
    Swal.fire({ title: 'Error', icon: 'error', text: 'The phone provided is longer or shorter than 10 characters, please try again', heightAuto: false });
    (<HTMLInputElement>document.getElementById('phone_m')).value = '';
  }
}
CheckEmail(event: Event) {
  const validRegex = /^[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})$/;
  const emailInput = document.querySelector<HTMLInputElement>('#email_m');
  const email = emailInput?.value;
  if (email && !email.match(validRegex)) {
    Swal.fire({title: 'Error', icon: 'error', text: 'The email provided is not a valid email. Please provide a valid email.', heightAuto: false});
    emailInput.value = '';
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
  SaveInfoMember(){

    $('#Preloader').show();
    $('#PhotoButtonPhoto').attr('disabled','disabled');
    $('#SaveMembutton').attr('disabled','disabled');
    var Photo = this.imageContent;
    var name = $('#name_m').val();
    var lastname = $('#lastname_m').val();
    var phone = $('#phone_m').val();
    var email = $('#email_m').val();
    var status = $('#status_me').val();


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

        this.MemberList();
      
  
        
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

  
 //Show the list

  MemberList(){

  const data ={
   
      
  };

  const headers = {
    'Content-Type' : 'application/x-www-form-urlencoded'
  }

      this.http.get(this.BaseUrl+'index.php/Members/ActiveMembersList', data, headers).then((response) =>{
        
        console.log(response.data)
        this.MemberPDFServer =  JSON.parse(response.data);
        console.log(this.MemberPDFServer);
         
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

  
  EditMember(MeID: any){

    $("#Preloader").show();
    $('#PhotoButtonPhoto').attr('disabled','disabled');

    var MeID = MeID;

    if(MeID!=""){

      const data = {
        MeID:MeID
      };
  
      const headers = {
        'Content-Type' : 'application/x-www-form-urlencoded'
      }

      this.http.post(this.BaseUrl+'index.php/Members/MemberById', data, headers).then((response) =>{

        $('#Preloader').hide();
        
        var Object = JSON.parse(response.data);

        var id = Object[0].id_Member;
        var name = Object[0].name_m;
        var lastname = Object[0].lastname_m;
        var phone = Object[0].phone_m;
        var email = Object[0].email_m;
        var status = Object[0].status;
        
        


        $('#id_me').val(id);
        $('#name_m').val(name);
        $('#lastname_m').val(lastname);
        $('#phone_m').val(phone);
        $('#email_m').val(email);
        $('#status_me').val(status);

        $("#SaveMembutton").hide(); 
        $("#UpdateMembutton").removeAttr('hidden');


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
          $("#SaveMembutton").hide(); 
          $("#UpdateMembutton").removeAttr('hidden');
          $('#PhotoButtonPhoto').removeAttr('hidden');
            } 
          });
        }else{
          $("#SaveMembutton").hide(); 
          $("#UpdateMembutton").removeAttr('hidden');
          $('#PhotoButtonPhoto').removeAttr('hidden');
          Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
        }

      });
    }
  }

  UpdateMember(){
    
    var id = $('#id_me').val();
    var name = $('#name_m').val();
    var lastname = $('#lastname_m').val();
    var phone = $('#phone_m').val();
    var email = $('#email_m').val();
    var status = $('#status_me').val();


    $('#Preloader').show();
    $('#UpdateMembutton').attr('disabled','disabled');
    

      const data = {
      
        id:id,
        name:name,
        lastname:lastname,
        phone:phone,
        email:email,
        status:status
      };

      const headers = {
        'Content-Type' : 'application/x-www-form-urlencoded'
      }

      if(id!="" && name!=""&& lastname!=""&& phone!=""&& email!="" &&  status!=""){
        this.http.post(this.BaseUrl+'index.php/Members/EditMembers', data, headers).then((response) =>{
          $('#Preloader').hide();
          $('#UpdateMembutton').removeAttr('disabled');
          $('#PhotoButtonPhoto').removeAttr('disabled');
  
  
          
          Swal.fire({title:'Success', icon:'success', text: 'Your information has been successfully updated',heightAuto:false});
         
          this.MemberList();

          $('#id_me').val('');
          $('#name_m').val('');
          $('#lastname_m').val('');
          $('#email_m').val('');
          $('#phone_m').val('');
          
          $('#status_me').val('');

          $("#SaveMembutton").show();
          $("#UpdateMembutton").attr("hidden",'enabled');
  
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
              $("#UpdateMembutton").removeAttr('disabled');
  
              } 
            });
          }else{
            $("#Preloader").hide();
            $("#UpdateMembutton").removeAttr('disabled');
            Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
          }
  
        });
      }else{
        $("#Preloader").hide();
        $("#UpdateMembutton").removeAttr('disabled');
        Swal.fire({title:'Warning', icon:'warning', text: 'There is missing info on the form',heightAuto:false});
      }
  
    }  
 
  DeleteMembers(PaID: any){

      
          var PaID2 = PaID;

      
            const data = {
              PaID2:PaID2
            };
        
            const headers = {
              'Content-Type' : 'application/x-www-form-urlencoded'
            }
      
            this.http.post(this.BaseUrl+'index.php/Members/DeleteMembersBD', data, headers).then((response) =>{

              Swal.fire({title:'Success', icon:'success', text: 'You deleted a member',heightAuto:false});
              this.MemberList();
      
      
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
      
                  } 
                });
              }else{
      
                Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
              }
      
            });
          
        }

  
  
     ngOnInit(){
   

}
}
