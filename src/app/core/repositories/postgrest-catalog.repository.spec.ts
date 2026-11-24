import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { APP_ENVIRONMENT } from '../config/catalog.tokens';
import { CATALOG_GARMENTS } from '../data/catalog.data';
import { PostgrestCatalogRepository } from './postgrest-catalog.repository';

describe('PostgrestCatalogRepository', () => {
  let repository: PostgrestCatalogRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PostgrestCatalogRepository,
        {
          provide: APP_ENVIRONMENT,
          useValue: {
            production: false,
            dataSource: 'postgrest',
            postgrestBaseUrl: 'http://localhost:3000',
            company: {
              name: 'Sastrería & Diseños',
              tagline: 'Test',
              foundedYear: 1998,
              email: 'test@example.com',
              phoneDisplay: '000',
              whatsappNumber: '000',
              city: 'Test',
              schedule: 'Test',
            },
          },
        },
      ],
    });

    repository = TestBed.inject(PostgrestCatalogRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('queries PostgREST /catalog_garments view with ordering parameters', async () => {
    const promise = firstValueFrom(repository.getGarments());

    const req = httpMock.expectOne(
      'http://localhost:3000/catalog_garments?select=*&order=year.desc,name.asc',
    );
    expect(req.request.method).toBe('GET');
    req.flush([CATALOG_GARMENTS[0]]);

    const result = await promise;
    expect(result.length).toBe(1);
    expect(result[0].code).toBe(CATALOG_GARMENTS[0].code);
  });

  it('falls back gracefully to the local archive when PostgREST is unreachable', async () => {
    const promise = firstValueFrom(repository.getGarments());

    const req = httpMock.expectOne(
      'http://localhost:3000/catalog_garments?select=*&order=year.desc,name.asc',
    );
    req.error(new ProgressEvent('NetworkError'));

    const result = await promise;
    expect(result.length).toBe(CATALOG_GARMENTS.length);
  });
});
