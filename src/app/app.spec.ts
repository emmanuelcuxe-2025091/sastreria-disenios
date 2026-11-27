import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { CATALOG_REPOSITORY } from './core/config/catalog.tokens';
import { LocalCatalogRepository } from './core/repositories/local-catalog.repository';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: CATALOG_REPOSITORY, useClass: LocalCatalogRepository },
      ],
    }).compileComponents();
  });

  it('should create the application shell', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render header and main landmark without footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('header')).toBeTruthy();
    expect(element.querySelector('main#main-content')).toBeTruthy();
    expect(element.querySelector('footer')).toBeNull();
    expect(element.querySelector('.brand-name')?.textContent).toContain('Sastrería & Diseños');
  });
});
