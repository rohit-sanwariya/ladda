import { Directive, ElementRef, Input, Renderer2, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[ladda]',
  standalone: true
})
export class LaddaDirective implements OnChanges {
  @Input('ladda') isLoading: boolean = false;
  @Input() spinnerSize: number = 16; // Default spinner size
  @Input() spinnerColor: string = '#fff'; // Default spinner color

  private spinnerElement: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('isLoading' in changes) {
      this.toggleSpinner(this.isLoading);
    }
  }

  private toggleSpinner(isLoading: boolean): void {
    const button = this.el.nativeElement as HTMLButtonElement;

    if (isLoading) {
      // Disable the button
      this.renderer.setAttribute(button, 'disabled', 'true');

      // Add spinner if not already added
      if (!this.spinnerElement) {
        this.spinnerElement = this.renderer.createElement('span');
        this.renderer.setStyle(this.spinnerElement, 'display', 'inline-block');
        this.renderer.setStyle(this.spinnerElement, 'marginLeft', '8px');
        this.renderer.setStyle(this.spinnerElement, 'width', `${this.spinnerSize}px`);
        this.renderer.setStyle(this.spinnerElement, 'height', `${this.spinnerSize}px`);
        this.renderer.setStyle(this.spinnerElement, 'border', '2px solid rgba(255, 255, 255, 0.6)');
        this.renderer.setStyle(this.spinnerElement, 'borderRadius', '50%');
        this.renderer.setStyle(this.spinnerElement, 'borderTopColor', this.spinnerColor);
        this.renderer.setStyle(this.spinnerElement, 'animation', 'spin 0.6s linear infinite');

        // Add custom CSS for the spinner animation
        const style = document.createElement('style');
        style.innerHTML = `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);

        this.renderer.appendChild(button, this.spinnerElement);
      }
    } else {
      // Enable the button and remove spinner
      this.renderer.removeAttribute(button, 'disabled');
      if (this.spinnerElement) {
        this.renderer.removeChild(button, this.spinnerElement);
        this.spinnerElement = null;
      }
    }
  }
}
