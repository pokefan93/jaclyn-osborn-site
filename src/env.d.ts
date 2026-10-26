/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    content: import('./lib/content').SiteContent;
  }
}
