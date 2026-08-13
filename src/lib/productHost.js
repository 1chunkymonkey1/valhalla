/**
 * Product hostname helpers.
 *
 * Preferred routes (work today): /wolf/fenrir-01
 * Optional hosts: fenrir01.valhallaco.org — needs wildcard DNS *.valhallaco.org
 * on the same Vercel project. Company path routes are never broken by this.
 */

import { resolveProductHost as resolveFromMatrices } from '../data/hallMatrices'

export function resolveProductHost(hostname = typeof window !== 'undefined' ? window.location.hostname : '') {
  return resolveFromMatrices(hostname)
}

export const PRODUCT_HOST_DNS_NOTE =
  'Path routes /{company}/{product-slug} work today. Product hostnames like fenrir01.valhallaco.org need wildcard DNS (*.valhallaco.org) and a matching Vercel domain before they resolve.'
