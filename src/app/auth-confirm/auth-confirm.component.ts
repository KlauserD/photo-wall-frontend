import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth-confirm',
  templateUrl: './auth-confirm.component.html',
  styleUrls: ['./auth-confirm.component.css']
})
export class AuthConfirmComponent implements OnInit {

  foreignToken: string = "";
  pwInput: string = ""

  invalidToken: boolean = false;
  authStatus: 'none' | 'success' | 'failure' | 'cooldown' = 'none';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.authService.CheckIfTokenIsValid(params['token']).subscribe(valid => {
        this.invalidToken = !valid;
        this.foreignToken = params['token'];
      });
    });
  }

  Confirm() {
    this.authService.TryAuthenticateForeignApp(this.foreignToken, this.pwInput)
      .subscribe(success => {
        if(success != null) {
          this.authStatus = success ? 'success' : 'failure'
        } else {
          this.authStatus = 'cooldown';
        }
      });
  }
}
