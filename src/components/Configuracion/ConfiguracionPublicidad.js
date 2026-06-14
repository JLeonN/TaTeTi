// Las skills de instalación y release cambian este valor: true para pruebas y false para producción.
export const esModoPruebaPublicidad = false

const idsPublicidadPrueba = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  intersticial: 'ca-app-pub-3940256099942544/1033173712',
}

const idsPublicidadProduccion = {
  banner: 'ca-app-pub-7620083100302566/2415845154',
  intersticial: 'ca-app-pub-7620083100302566/3775645392',
}

export const idsPublicidad = esModoPruebaPublicidad ? idsPublicidadPrueba : idsPublicidadProduccion
