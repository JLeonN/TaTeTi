// Las skills de instalación y release cambian este valor: true para pruebas y false para producción.
export const esModoPruebaPublicidad = true

const idsPublicidadPrueba = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  intersticial: 'ca-app-pub-3940256099942544/1033173712',
  recompensado: 'ca-app-pub-3940256099942544/5224354917',
}

const idsPublicidadProduccion = {
  banner: 'ca-app-pub-7620083100302566/2415845154',
  intersticial: 'ca-app-pub-7620083100302566/3775645392',
  recompensado: 'ca-app-pub-7620083100302566/4478872457',
}

export const idsPublicidad = esModoPruebaPublicidad ? idsPublicidadPrueba : idsPublicidadProduccion
