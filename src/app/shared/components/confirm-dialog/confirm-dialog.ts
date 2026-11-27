import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  host: {
    '(document:keydown.escape)': 'cancelled.emit()',
  },
  template: `
    <div class="dialog-backdrop" (click)="cancelled.emit()">
      <div
        class="dialog-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        (click)="$event.stopPropagation()"
      >
        <h2 id="confirm-dialog-title" class="dialog-title">{{ title() }}</h2>
        <p id="confirm-dialog-message" class="dialog-message">{{ message() }}</p>
        <div class="dialog-actions">
          <button type="button" class="btn btn-danger" (click)="confirmed.emit()">
            {{ confirmLabel() }}
          </button>
          <button type="button" class="btn btn-outline" (click)="cancelled.emit()">
            {{ cancelLabel() }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .dialog-backdrop {
      position: fixed;
      inset: 0;
      z-index: 500;
      display: grid;
      place-items: center;
      padding: 1rem;
      background: rgba(16, 36, 77, 0.52);
      backdrop-filter: blur(4px);
    }
    .dialog-card {
      width: 100%;
      max-width: 440px;
      padding: clamp(1.35rem, 4vw, 1.85rem);
      background: var(--color-surface);
      border: 1px solid var(--color-border-strong);
      box-shadow: var(--shadow-elevated);
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
    }
    .dialog-title {
      font-size: 1.55rem;
    }
    .dialog-message {
      font-size: 0.94rem;
      line-height: 1.6;
      color: var(--color-ink-soft);
    }
    .dialog-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 0.4rem;
    }
    .btn-danger {
      background-color: #b91c1c;
      border-color: #b91c1c;
      color: #ffffff;
    }
    .btn-danger:hover {
      background-color: #991b1b;
      border-color: #991b1b;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  readonly title = input<string>('Confirmar eliminación');
  readonly message = input.required<string>();
  readonly confirmLabel = input<string>('Sí, eliminar');
  readonly cancelLabel = input<string>('Cancelar');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
