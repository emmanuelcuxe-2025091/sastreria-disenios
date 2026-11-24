import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <section class="not-found">
      <div class="container not-found-inner">
        <span class="eyebrow">Error 404</span>
        <h1>Página no encontrada</h1>
        <p>
          La dirección solicitada no forma parte del catálogo de Sastrería &amp; Diseños. Puede
          regresar al inicio o explorar nuestras prendas documentadas.
        </p>
        <div class="actions">
          <a class="btn btn-primary" routerLink="/catalogo">Ver catálogo</a>
          <a class="btn btn-outline" routerLink="/">Volver al inicio</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .not-found {
      padding-block: 6rem;
    }
    .not-found-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1.15rem;
    }
    h1 {
      font-size: clamp(2.2rem, 4.5vw, 3.3rem);
    }
    p {
      max-width: 48ch;
      color: var(--color-ink-soft);
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.9rem;
      margin-top: 0.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent {}
