import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => {
    console.error(err);
    const root = document.querySelector('app-root');
    if (root) {
      const aviso = document.createElement('p');
      aviso.setAttribute('role', 'alert');
      aviso.textContent = 'Não foi possível carregar os dados. Verifique a conexão e tente novamente.';
      const tentar = document.createElement('button');
      tentar.textContent = 'Tentar novamente';
      tentar.onclick = () => window.location.reload();
      root.replaceChildren(aviso, tentar);
    }
  });
