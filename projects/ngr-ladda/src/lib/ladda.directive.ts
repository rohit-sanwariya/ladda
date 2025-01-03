import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[ladda]',
  standalone: true,
})
export class LaddaDirective implements OnChanges {
  @Input('ladda') isLoading: boolean = false;
  @Input() spinnerSize: number = 16; // Default spinner size
  @Input() spinnerColor: string = '#fff'; // Default spinner color
  @Input() progressText: string | null = null; // Text to display during progress
  @Input() progressType: 'spinner' | 'linear' = 'spinner'; // Progress type

  private progressElement: HTMLElement | null = null;
  private originalButtonText: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('isLoading' in changes) {
      this.toggleProgress(this.isLoading);
    }
  }

  private toggleProgress(isLoading: boolean): void {
    const button = this.el.nativeElement as HTMLButtonElement;

    if (isLoading) {
      // Save the original button text
      if (!this.originalButtonText) {
        this.originalButtonText = button.innerHTML.trim();
      }

      // Disable the button
      this.renderer.setAttribute(button, 'disabled', 'true');

      // Replace button content with progress elements
      if (!this.progressElement) {
        if (this.progressType === 'spinner') {
          this.addSpinner(button);
        } else if (this.progressType === 'linear') {
          this.addLinearProgress(button);
        }
      }

      // Add progress text if defined
      if (this.progressText) {
        const textNode = this.renderer.createText(` ${this.progressText}`);
        this.renderer.appendChild(button, textNode);
      }
    } else {
      // Enable the button and restore original text
      this.renderer.removeAttribute(button, 'disabled');
      button.innerHTML = this.originalButtonText;

      // Remove progress element
      if (this.progressElement) {
        this.renderer.removeChild(button, this.progressElement);
        this.progressElement = null;
      }
    }
  }

  private addSpinner(button: HTMLButtonElement): void {
    this.progressElement = this.renderer.createElement('span');
    this.renderer.setStyle(this.progressElement, 'display', 'inline-block');
    this.renderer.setStyle(this.progressElement, 'marginLeft', '8px');
    this.renderer.setStyle(this.progressElement, 'width', `${this.spinnerSize}px`);
    this.renderer.setStyle(this.progressElement, 'height', `${this.spinnerSize}px`);
    this.renderer.setStyle(this.progressElement, 'border', '2px solid rgba(255, 255, 255, 0.6)');
    this.renderer.setStyle(this.progressElement, 'borderRadius', '50%');
    this.renderer.setStyle(this.progressElement, 'borderTopColor', this.spinnerColor);
    this.renderer.setStyle(this.progressElement, 'animation', 'spin 0.6s linear infinite');

    // Add custom CSS for the spinner animation
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    this.renderer.appendChild(button, this.progressElement);
  }

  private addLinearProgress(button: HTMLButtonElement): void {
    this.progressElement = this.renderer.createElement('div');
    this.renderer.setStyle(this.progressElement, 'position', 'absolute');
    this.renderer.setStyle(this.progressElement, 'bottom', '0');
    this.renderer.setStyle(this.progressElement, 'left', '0');
    this.renderer.setStyle(this.progressElement, 'width', '100%');
    this.renderer.setStyle(this.progressElement, 'height', '4px');
    this.renderer.setStyle(this.progressElement, 'backgroundColor', this.spinnerColor);
    this.renderer.setStyle(this.progressElement, 'animation', 'progress 2s linear infinite');

    // Add custom CSS for linear progress animation
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes progress {
        0% { transform: scaleX(0); }
        50% { transform: scaleX(0.5); }
        100% { transform: scaleX(1); }
      }
    `;
    document.head.appendChild(style);

    this.renderer.appendChild(button, this.progressElement);
  }
}
