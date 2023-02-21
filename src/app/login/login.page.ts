
import { Component, OnInit } from '@angular/core';
import { Platform, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { AppComponent } from "../app.component";
import {HTTP} from '@awesome-cordova-plugins/http/ngx';
import  Swal from 'sweetalert2'; 
import * as $ from "jquery";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  BaseUrl = this.Link.BaseLink();

  constructor(private http: HTTP, private menuCtrl : MenuController, private router:Router, private storage: Storage,private Link: AppComponent) { }


  ionViewWillEnter(){
    this.menuCtrl.enable(false);
  }
  ionViewWillLeave(){
    this.menuCtrl.enable(true);
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true);
  }

  EsconderPanel(){
    $("#panelcontraseña").show();
    $("#panellogin").hide();
  }
  

  Login() {
    $('#preLoader').show();
    $('#btn-login').attr('disabled', 'disabled');
    $('#btn-resetLogin').attr('disabled', 'disabled');
    $('#btn-hide').attr('disabled', 'disabled');

    var usuario = $('#user').val();
    var pass = $('#pass').val();

    if (usuario != '' && pass != '') {
      const data = {
        usuario: usuario,
        pass: pass,
      };

      const headers = {
        'Content-Type': 'application/json',
      };

      this.http
        .post(this.BaseUrl + 'index.php/Session/validateLogin', data, headers)
        .then((response) => {
          let obj = JSON.parse(response.data);
          console.log(response);

          if (obj != '') {
            let msg = obj;

            if (msg == 'OK-') {
              $('#preLoader').hide();
              $('#btn-login').removeAttr('disabled');
              $('#btn-resetLogin').removeAttr('disabled');
              $('#btn-hide').removeAttr('disabled');

              this.storage.set('user', usuario);
              this.storage.set('pass', pass);
              this.router.navigate(['/home']);
              $('#user').val('');
              $('#pass').val('');
            } else if (msg == 'IUOP') {
              $('#preLoader').hide();
              $('#btn-login').removeAttr('disabled');
              $('#btn-resetLogin').removeAttr('disabled');
              $('#btn-hide').removeAttr('disabled');
              Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Incorrect user or password',
                heightAuto: false,
              });
            } else if (msg == 'UWOA') {
              $('#preLoader').hide();
              $('#btn-login').removeAttr('disabled');
              $('#btn-resetLogin').removeAttr('disabled');
              $('#btn-hide').removeAttr('disabled');

              Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'User without autenthication',
                heightAuto: false,
              });
            } else if (msg == 'UWAS') {
              $('#preLoader').hide();
              $('#btn-login').removeAttr('disabled');
              $('#btn-resetLogin').removeAttr('disabled');
              $('#btn-hide').removeAttr('disabled');

              Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'User without an active session',
                heightAuto: false,
              });
            }
          }
        })
        .catch((error) => {
          $('#preLoader').hide();
          $('#btn-login').removeAttr('disabled');
          $('#btn-resetLogin').removeAttr('disabled');
          $('#btn-hide').removeAttr('disabled');

          Swal.fire({
            title: 'Error',
            icon: 'error',
            text: 'An internal error has occured, please contact anyone else.',
            heightAuto: false,
          });

          console.log(error);
        });
    } else {
      $('#preLoader').hide();
      $('#btn-login').removeAttr('disabled');
      $('#btn-resetLogin').removeAttr('disabled');
      $('#btn-hide').removeAttr('disabled');

      Swal.fire({
        title: 'Warning',
        icon: 'warning',
        text: 'There is missing information',
        heightAuto: false,
      });
    }
  }


  ResetLogin() {
    $('#preLoader').show();
    $('#btn-resetLogin').attr('disabled', 'disabled');
    $('#btn-login').attr('disabled', 'disabled');
    $('#btn-hide').attr('disabled', 'disabled');

    var usuarioreset = $('#user').val();
    var passreset = $('#pass').val();

    if (usuarioreset != '' && passreset != '') {
      const data = {
        usuarioreset: usuarioreset,
        passreset: passreset,
      };

      const headers = {
        'Content-Type': 'application/json',
      };
      this.http
        .post(this.BaseUrl + 'index.php/Session/resetLogin', data, headers)
        .then((response) => {
          console.log(response);
          var obj = JSON.parse(response.data);

          if (obj != '') {
            var msg = obj;

            if (msg == 'OK') {
              Swal.fire({
                title: 'OK',
                icon: 'success',
                text: 'Session has been restored successfully',
                heightAuto: false,
              });

              $('#preLoader').hide();
              $('#btn-login').removeAttr('disabled');
              $('#btn-resetLogin').removeAttr('disabled');
              $('#btn-hide').removeAttr('disabled');

              $('#user').val('');
              $('#pass').val('');
            } else if (msg == 'IUOP') {
              $('#preLoader').hide();
              $('#btn-login').removeAttr('disabled');
              $('#btn-resetLogin').removeAttr('disabled');
              $('#btn-hide').removeAttr('disabled');
              Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'User or incorrect password',
                heightAuto: false,
              });
            } else if (msg == 'UWOA') {
              $('#preLoader').hide();
              $('#btn-login').removeAttr('disabled');
              $('#btn-resetLogin').removeAttr('disabled');
              $('#btn-hide').removeAttr('disabled');
              Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'User without access to this app',
                heightAuto: false,
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
          $('#preLoader').hide();
          $('#btn-login').removeAttr('disabled');
          $('#btn-resetLogin').removeAttr('disabled');
          $('#btn-hide').removeAttr('disabled');
          Swal.fire({
            title: 'Error',
            icon: 'error',
            text: 'An internal server error has occurred please contact the site admin',
            heightAuto: false,
          });
        });
    } else {
      $('#preLoader').hide();
      $('#btn-login').removeAttr('disabled');
      $('#btn-resetLogin').removeAttr('disabled');
      $('#btn-hide').removeAttr('disabled');
      Swal.fire({
        title: 'Warning',
        icon: 'warning',
        text: 'There is missing info on the form',
        heightAuto: false,
      });
    }
  }

  RestablecerContrasena() {
    $('#preLoader').show();
    $('#btn-restore').attr('disabled', 'disabled');
    $('#btn-show').attr('disabled', 'disabled');

    var usuario = $('#userRes').val();
    var correo = $('#emailRes').val();
    var telefono = $('#phoneRes').val();

    if (usuario != '' && correo != '' && telefono != '') {
      const data = {
        usuario: usuario,
        correo: correo,
        telefono: telefono,
      };

      const headers = {
        'Content-Type': 'application/json',
      };

      this.http
        .post(
          this.BaseUrl + 'index.php/Session/restablecerContrasena',
          data,
          headers
        )
        .then((response) => {
          console.log(response);
          var obj = JSON.parse(response.data);

          var contraseña = obj.contrasena;

          if (obj.mensaje == 'TRUE') {
            $('#preLoader').hide();
            $('#btn-restore').removeAttr('disabled');
            $('#btn-show').removeAttr('disabled');

            $('#userRes').val('');
            $('#emailRes').val('');
            $('#phoneRes').val('');

            Swal.fire({
              title: 'OK',
              icon: 'success',
              text:
                'Password has been restored successfully, your password is: ' +
                contraseña +
                '',
              heightAuto: false,
            });

            $('#panelcontraseña').hide();
            $('#panellogin').show();
          } else {
            $('#preLoader').hide();
            $('#btn-restore').removeAttr('disabled');
            $('#btn-show').removeAttr('disabled');

            Swal.fire({
              title: 'Error',
              icon: 'error',
              text: 'Data is incorrect',
              heightAuto: false,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          $('#preLoader').hide();
          $('#btn-restore').removeAttr('disabled');
          $('#btn-show').removeAttr('disabled');
          Swal.fire({
            title: 'Error',
            icon: 'error',
            text: 'An internal server error has occurred please contact the site admin',
            heightAuto: false,
          });
        });
    } else {
      $('#preLoader').hide();
      $('#btn-restore').removeAttr('disabled');
      $('#btn-show').removeAttr('disabled');
      Swal.fire({
        title: 'Warning',
        icon: 'warning',
        text: 'There is missing info on the form',
        heightAuto: false,
      });
    }
  }

  MostrarPanel(){
    $("#panelcontraseña").hide();
    $("#panellogin").show();
  }

  async ngOnInit() {

    await this.storage.create();
    $("#panelcontraseña").hide();
  }

}