import { TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
setupZoneTestEnv(); // Ensures zone.js testing environment is correctly set up

// Global TestBed configuration
TestBed.configureTestingModule({
  imports: [TranslateModule.forRoot()], // Common testing modules
  providers: [provideAnimations()],
});
