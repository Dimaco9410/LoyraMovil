import { Component } from '@angular/core';
import { Platform, MenuController} from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import  Swal from 'sweetalert2'; 
import {HTTP} from '@awesome-cordova-plugins/http/ngx';
import * as $ from "jquery";


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  URL_Link = "http://192.168.3.41/BACKEND_LMovil/";
  
  constructor(private http: HTTP, private menuCtrl : MenuController, private router:Router, private storage: Storage, private platform:Platform) {
    this.initializeApp();
  }


  CloseMenu() {  

    this.menuCtrl.close();
 
    }
  BaseLink (){
    return this.URL_Link;
  }

  initializeApp() {
    this.platform.ready().then(async() => {

      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener('backbutton', function (event) {
          event.preventDefault();
          event.stopPropagation();
          console.log('hello');
        }, false);
      });

      await this.storage.create();

    });
  }
  
  
  async LogOut() {
    let usuario = await this.storage.get('user');

    const data = {
      usuario: usuario,
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    this.http
      .post(this.URL_Link + 'index.php/Session/logout', data, headers)
      .then((response) => {
        this.storage.clear();
        this.router.navigate(['/login']);
        console.log(response);
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'An internal server error has occurred please contact the site admin',
          heightAuto: false,
        });
        console.log(error);
      });
  }

  
}

