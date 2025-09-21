import { AfterContentInit, Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import * as QRCode from 'qrcode'
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, AfterContentInit {

  private appIdToken: string;
  private returnUrl: string | null = null;

  imgDataUrl = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { 
    this.appIdToken = authService.GetOwnAppIdToken();
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params)=> {
      this.returnUrl = params['returnUrl'];
    })
  }

  ngAfterContentInit(): void {
    var canvas = document.getElementById('qrCanvas') as HTMLCanvasElement;

    const confirmUrl = environment.url.concat('/auth-confirm/', this.appIdToken);

    QRCode.toDataURL(confirmUrl).then(url => this.imgDataUrl = url);

    setTimeout(() => this.checkAuthentication(), 10000);
  }

  private checkAuthentication() {
    this.authService.CheckAuthenticationStatus().subscribe(success => {
      if(success) {
        const route = this.returnUrl != null ? this.returnUrl as string : '';

        this.router.navigate([route])
      } else {
        setTimeout(() => this.checkAuthentication(), 10000);
      }
    });
  }
}
