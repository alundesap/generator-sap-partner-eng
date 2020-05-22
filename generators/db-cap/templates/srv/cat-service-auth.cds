using { CatalogService } from './cat-service';

// Re-run the following command after changing any @(requires: []) definition
// Run this from the root of the project.
// cds compile srv/ --to xsuaa,json > cds-security.json

annotate CatalogService with @(requires: ['Admin','User']);

annotate CataloogService.Orders with @(restrict: [
  { grant: ['READ','WRITE'], to: 'Admin' }, 
  { grant: ['READ'], to: 'User' }
]);
