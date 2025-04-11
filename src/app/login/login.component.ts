import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  mensajeError: string = '';
  usuario = '';
  password = '';

  // Modal control
  isRegisterModalVisible: boolean = false;

  // Datos de registro
  nombre: string = '';
  apellido: string = '';
  usuarioRegistro: string = '';
  contrasenaRegistro: string = ''; // ✅ Corregido sin ñ

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.mensajeError = '';
    this.authService.login(this.usuario, this.password).subscribe(
      (response) => {
        console.log('user logged', response);
        this.router.navigate(['/inventario']); // Redirigir a la página de inventario después del inicio de sesión exitoso
      },
      (error) => {
        console.error('Error login', error);
        this.mensajeError = 'Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.';
      }
    );
  }

  showRegisterModal() {
    this.isRegisterModalVisible = true;
  }

  hideRegisterModal() {
    this.isRegisterModalVisible = false;
  }

  onRegisterSubmit() {
    const nuevoUsuario = {
      nombre: this.nombre,
      apellido: this.apellido,
      usuario: this.usuarioRegistro,
      contrasena: this.contrasenaRegistro 
    };

    console.log('Registrando usuario:', nuevoUsuario);
    
    this.hideRegisterModal();
  }
}
