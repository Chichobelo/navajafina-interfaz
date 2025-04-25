import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Service {
  name: string;
  price: number;
  duration: number;
}

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css'],
})
export class PagesComponent implements OnInit {
  // Servicios - cambiamos para manejar múltiples selecciones
  selectedServices: Service[] = [];
  
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

  // Seleccionar servicio - Modificada para selección múltiple
  selectService(name: string, price: number, duration: number, nextStepId: string): void {
    console.log(`Intentando seleccionar servicio: ${name}`); // Debugging
    
    // Revisamos si el servicio ya está seleccionado
    const existingServiceIndex = this.selectedServices.findIndex(s => s.name === name);
    
    if (existingServiceIndex >= 0) {
      // Si ya está seleccionado, lo removemos
      this.selectedServices.splice(existingServiceIndex, 1);
      console.log(`Removido servicio: ${name}`);
    } else {
      // Si no está seleccionado, lo agregamos
      this.selectedServices.push({ name, price, duration });
      console.log(`Agregado servicio: ${name}`);
    }

    // Solo avanzamos al siguiente paso si hay al menos un servicio seleccionado
    if (this.selectedServices.length > 0 && this.selectedServices.length === 1) {
      // Solo avanzamos automáticamente en la primera selección
      this.scrollTo(nextStepId);
    }

    // Actualizamos la clase 'selected' en todas las tarjetas de servicio
    this.updateServiceCardSelection();
  }
  
  // Método auxiliar para actualizar la selección visual
  updateServiceCardSelection(): void {
    // Obtenemos todas las tarjetas de servicio
    const serviceCards = document.querySelectorAll('.service-card');
    
    // Para cada tarjeta, verificamos si su servicio está en la lista de seleccionados
    serviceCards.forEach(card => {
      const cardTitle = card.querySelector('h3')?.textContent?.trim();
      
      // Si el servicio está seleccionado, agregamos la clase, si no, la removemos
      if (cardTitle && this.isServiceSelected(cardTitle)) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });
  }
  
  // Método para comprobar si un servicio está seleccionado - ignora acentos y es case insensitive
  isServiceSelected(name: string): boolean {
    const normalizedName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return this.selectedServices.some(s => 
      s.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === normalizedName
    );
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
  
  // Calcular total del precio
  getTotalPrice(): number {
    return this.selectedServices.reduce((total, service) => total + service.price, 0);
  }
  
  // Calcular duración total
  getTotalDuration(): number {
    return this.selectedServices.reduce((total, service) => total + service.duration, 0);
  }
  
  // Verificar si el formulario es válido
  isFormValid(): boolean {
    return !!(
      this.selectedServices.length > 0 && 
      this.selectedProfessionalName && 
      this.selectedDate && 
      this.selectedTime &&
      this.selectedPaymentMethod
    );
  }
  
  // Confirmar reserva
  confirmBooking(): void {
    if (this.isFormValid()) {
      // Aquí podrías enviar los datos al servidor o realizar alguna acción
      const bookingData = {
        services: this.selectedServices,
        professional: this.selectedProfessionalName,
        date: this.selectedDate,
        time: this.selectedTime,
        paymentMethod: this.selectedPaymentMethod,
        totalPrice: this.getTotalPrice(),
        totalDuration: this.getTotalDuration()
      };
      
      console.log('Reserva confirmada:', bookingData);
      alert('¡Reserva confirmada con éxito!');
      
      // Reiniciar el formulario
      this.resetForm();
    }
  }
  
  // Reiniciar formulario
  resetForm(): void {
    this.selectedServices = [];
    this.selectedProfessionalName = null;
    this.selectedProfessionalRole = null;
    this.selectedDate = null;
    this.selectedTime = null;
    this.selectedPaymentMethod = null;
    
    // Remover clase selected de todas las tarjetas
    document.querySelectorAll('.service-card, .professional-card').forEach(card => {
      card.classList.remove('selected');
    });
  }
}