import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css',
})
export class LeftSidebarComponent {
  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  isUser:string |null =null;
  items = [
    {
      routeLink: 'inventario',
      icon: 'fal fa-home',
      label: 'inicio',
      user: 'ADMIN',
    },
    {
      routeLink: 'pages',
      icon: 'fal fa-calendar-alt', // Updated to a reservation-related icon
      label: 'Reservas',
      user: 'ADMIN',
    },
    {
      routeLink: 'formula',
      icon: 'fal fa-user-plus',
      label: 'Mis reservas',
      user: 'ADMIN',
    },
    {
      routeLink: 'settings',
      icon: 'fal fa-user-plus',
      label: 'crear usuario',
      user: 'ADMIN',
    },
    {
      routeLink: 'logout',
      icon: 'fal fa-sign-out-alt',
      label: 'salir',
      user: '',
    },
  ];
  ngOnInit(){
    this.isUser = localStorage.getItem("role")
  }
  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
}