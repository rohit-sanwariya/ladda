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
  @Input() progressText: string = ''; // Text to display during progress
  @Input() progressType: 'spinner' | 'linear' = 'spinner'; // Progress type

  private progressElement: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('isLoading' in changes) {
      this.toggleProgress(this.isLoading);
    }
  }

  private toggleProgress(isLoading: boolean): void {
    const button = this.el.nativeElement as HTMLButtonElement;

    if (isLoading) {
      // Disable the button
      this.renderer.setAttribute(button, 'disabled', 'true');

      // Add progress if not already added
      if (!this.progressElement) {
        if (this.progressType === 'spinner') {
          this.addSpinner(button);
        } else if (this.progressType === 'linear') {
          this.addLinearProgress(button);
        }
      }

      // Add progress text
      if (this.progressText) {
        const textElement = this.renderer.createText(` ${this.progressText}`);
        this.renderer.appendChild(button, textElement);
      }
    } else {
      // Enable the button and remove progress
      this.renderer.removeAttribute(button, 'disabled');
      if (this.progressElement) {
        this.renderer.removeChild(button, this.progressElement);
        this.progressElement = null;
      }

      // Remove progress text
      const textNode = button.childNodes[button.childNodes.length - 1];
      if (textNode.nodeType === Node.TEXT_NODE) {
        this.renderer.removeChild(button, textNode);
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
