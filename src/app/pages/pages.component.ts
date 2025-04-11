import { Component, OnInit } from '@angular/core';
import { PackingService } from '../services/Packing.service';
import { Packing } from '../interface/Packing.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css'],
})
export class PagesComponent implements OnInit {
  // Servicios
  selectedServiceId: string | null = null;
  selectedServiceName: string | null = null;
  selectedServicePrice: number | null = null;
  selectedServiceDuration: number | null = null;
  
  // Profesionales
  selectedProfessionalId: string | null = null;
  selectedProfessionalName: string | null = null;
  selectedProfessionalRole: string | null = null;
  
  // Fecha y hora
  selectedDate: string | null = null;
  selectedTime: string | null = null;
  availableTimes: string[] = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00'
  ];
  
  // Método de pago
  selectedPaymentMethod: string | null = null;

  // Slider steps
  steps = [
    { title: 'Paso 1: Selecciona un Servicio', subtitle: 'Elige el tipo de servicio que deseas reservar' },
    { title: 'Paso 2: Confirma tu Reserva', subtitle: 'Completa los detalles de tu cita' },
    { title: 'Paso 3: Selecciona un Profesional', subtitle: 'Elige el profesional con quien deseas agendar' },
    { title: 'Paso 4: Hacer la Reserva', subtitle: 'Revisa los detalles y confirma tu reserva' }
  ];
  currentStep = 0;
  sliderInterval: any;
  
  constructor() { }

  ngOnInit(): void {
    if (this.steps && this.steps.length > 0) {
      this.startSlider();
    }
  }

  startSlider(): void {
    this.sliderInterval = setInterval(() => {
      this.currentStep = (this.currentStep + 1) % this.steps.length;
    }, 5000); // Change step every 5 seconds
  }

  ngOnDestroy(): void {
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval); // Clear interval on component destroy
    }
  }
  
  // Scroll to the next step
  scrollTo(stepId: string): void {
    const element = document.getElementById(stepId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Seleccionar servicio
  selectService(name: string, price: number, duration: number, nextStepId: string): void {
    this.selectedServiceName = name;
    this.selectedServicePrice = price;
    this.selectedServiceDuration = duration;
    this.scrollTo(nextStepId);
    
    // Remover clase selected de todas las tarjetas de servicio
    document.querySelectorAll('.service-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    // Añadir clase selected a la tarjeta seleccionada
    const serviceCards = document.querySelectorAll('.service-card');
    for (let i = 0; i < serviceCards.length; i++) {
      const cardTitle = serviceCards[i].querySelector('h3')?.textContent;
      if (cardTitle === name) {
        serviceCards[i].classList.add('selected');
        break;
      }
    }
  }
  
  // Seleccionar profesional
  selectProfessional(name: string, role: string, nextStepId: string): void {
    this.selectedProfessionalName = name;
    this.selectedProfessionalRole = role;
    this.scrollTo(nextStepId);
    
    // Remover clase selected de todas las tarjetas de profesionales
    document.querySelectorAll('.professional-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    // Añadir clase selected a la tarjeta seleccionada
    const professionalCards = document.querySelectorAll('.professional-card');
    for (let i = 0; i < professionalCards.length; i++) {
      const cardTitle = professionalCards[i].querySelector('h3')?.textContent;
      if (cardTitle === name) {
        professionalCards[i].classList.add('selected');
        break;
      }
    }
  }
  
  // Formatear precio
  formatPrice(price: number): string {
    return (price / 1000).toFixed(3).replace('.', ',');
  }
  
  // Verificar si el formulario es válido
  isFormValid(): boolean {
    return !!(
      this.selectedServiceName && 
      this.selectedProfessionalName && 
      this.selectedDate && 
      this.selectedTime &&
      this.selectedPaymentMethod // Ensure payment method is selected
    );
  }
  
  // Confirmar reserva
  confirmBooking(): void {
    if (this.isFormValid()) {
      // Aquí podrías enviar los datos al servidor o realizar alguna acción
      const bookingData = {
        service: this.selectedServiceName,
        professional: this.selectedProfessionalName,
        date: this.selectedDate,
        time: this.selectedTime,
        paymentMethod: this.selectedPaymentMethod, // Include payment method
        price: this.selectedServicePrice,
        duration: this.selectedServiceDuration
      };
      
      console.log('Reserva confirmada:', bookingData);
      alert('¡Reserva confirmada con éxito!');
      
      // Reiniciar el formulario
      this.resetForm();
    }
  }
  
  // Reiniciar formulario
  resetForm(): void {
    this.selectedServiceName = null;
    this.selectedServicePrice = null;
    this.selectedServiceDuration = null;
    this.selectedProfessionalName = null;
    this.selectedProfessionalRole = null;
    this.selectedDate = null;
    this.selectedTime = null;
    this.selectedPaymentMethod = null; // Reset payment method
    
    // Remover clase selected de todas las tarjetas
    document.querySelectorAll('.service-card, .professional-card').forEach(card => {
      card.classList.remove('selected');
    });
  }
}