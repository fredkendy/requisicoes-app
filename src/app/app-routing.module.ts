import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/public/login/login.component';
import { AuthguardService } from './services/authguard.service';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  //nao associamos a rota ao componente, e sim ao modulo
  //importação dinamica: util para carregar modulo sob demanda
  //se o user estiver logado, a url raiz será do componente painel. Se n, o metodo retorna false (rota do componente login)
  {path: 'admin/painel', loadChildren: () => import('./components/admin/painel/painel.module')
    .then(m => m.PainelModule), canActivate: [AuthguardService]},
  {path: 'admin/departamento', loadChildren: () => import('./components/admin/departamento/departamento.module')
    .then(m => m.DepartamentoModule), canActivate: [AuthguardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
