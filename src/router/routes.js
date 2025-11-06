const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/JugarContraIA.vue') },
      { path: 'jugador-vs-jugador', component: () => import('pages/JugarMultijugador.vue') },
      { path: 'configuracion', component: () => import('pages/ConfiguracionPage.vue') },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
