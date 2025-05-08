import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnInit {
  @Input() appHighlight: boolean = true;
  @Input() highlightColor: string = '#28a745';
  @Input() highlightBgColor: string = 'rgba(40, 167, 69, 0.05)';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.highlight();
  }

  private highlight(): void {
    if (this.appHighlight) {
      this.renderer.setStyle(this.el.nativeElement, 'border', `2px solid ${this.highlightColor}`);
      this.renderer.setStyle(this.el.nativeElement, 'background-color', this.highlightBgColor);
      this.renderer.addClass(this.el.nativeElement, 'highlighted');
      
      // Ajouter une animation légère
      this.renderer.setStyle(this.el.nativeElement, 'transition', 'all 0.3s ease');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'border');
      this.renderer.removeStyle(this.el.nativeElement, 'background-color');
      this.renderer.removeClass(this.el.nativeElement, 'highlighted');
    }
  }
}