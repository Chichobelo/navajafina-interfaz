import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { User } from '../interface/user.model';
import { RegisterRequest, Role } from '../interface/registerRequest.model';
import { AuthResponse } from '../interface/AuthResponse.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  user: RegisterRequest[] = [];
  searchTerm = '';
  showModal = false;
  showDeleteModal = false;
  isEditing = false;
  userToDelete: RegisterRequest | null = null;

  currentUser: RegisterRequest = {
    role: Role.USER,
    username: '',
    lastname: '',
    firstname: '',
    password: '',
    id: 0
  };

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.user = users;
      },
      error: (error) => {
        console.error('Error fetching workers', error);
      }
    });
  }

  filteredUsers() {
    if (!this.searchTerm) {
      return this.user;
    }
    return this.user.filter((user) =>
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openNewUsersForm() {
    this.isEditing = false;
    this.currentUser = {
      role: Role.USER,
      username: '',
      lastname: '',
      firstname: '',
      password: '',
      id: 0
    };
    this.showModal = true;
  }

  editUser(user: RegisterRequest) {
    this.isEditing = true;
    this.currentUser = { ...user, password: '' };
    this.showModal = true;
  }

  deleteUser(user: RegisterRequest) {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.userToDelete?.id) {
      this.authService.deleteUser(this.userToDelete.id).subscribe({
        next: () => {
          this.loadUsers();
          this.showDeleteModal = false;
          this.userToDelete = null;
        },
        error: (error) => {
          console.error('Error deleting worker', error);
        }
      });
    }
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.userToDelete = null;
  }

  closeModal(): void {
    this.showModal = false;
  }

  register(): void {
    if (
      !this.currentUser.username ||
      !this.currentUser.firstname ||
      !this.currentUser.lastname ||
      !this.currentUser.role
    ) {
      this.errorMessage = 'Por favor, complete todos los campos obligatorios.';
      return;
    }

    const newUser: RegisterRequest = {
      id: this.currentUser.id || 0,
      username: this.currentUser.username,
      lastname: this.currentUser.lastname,
      firstname: this.currentUser.firstname,
      password: this.currentUser.password || '',
      role: this.currentUser.role
    };

    this.authService.register(newUser).subscribe({
      next: (response: AuthResponse) => {
        this.successMessage = 'Usuario registrado con éxito.';
        this.loadUsers();
        setTimeout(() => this.closeModal(), 300);
      },
      error: (err) => {
        this.errorMessage = 'Error al registrar el usuario. Intenta nuevamente.';
        console.error(err);
      }
    });
  }
}
