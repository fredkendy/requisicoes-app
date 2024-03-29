import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email!: string;
  senha!: string;
  mensagem!: string;
  emailEnviado!: boolean;
  constructor(private authServ: AuthenticationService, private router: Router) {}

  ngOnInit(): void {
    
  }

  logar() {
    //checar preenchimento de email e senha
    try {
      if (this.email == undefined || this.senha == undefined) {
        this.mensagem = 'Usuário ou senha vazios'
        return
      }
      //com o objeto authServ, invocamos o método de login
      this.authServ.login(this.email, this.senha)
        .then(() => {
          this.router.navigate(['/admin/painel'])
        })
        //tratando exceções com o catch (com switch, pode-se verificar os tipos de erros que podem surgir ao logar no firebase)
        .catch(erro => {
          let detalhes = '';
          switch (erro.code) {
            case 'auth/user-not-found': {
              detalhes = 'Não existe usuário para o email informado';
              break;
            }
            case 'auth/invalid-email': {
              detalhes = 'Email inválido';
              break;
            }
            case 'auth/wrong-password': {
              detalhes = 'Senha Inválida';
              break;
            }
            default: {
              detalhes = erro.message;
              break;
            }
          }
          this.mensagem = `Erro ao logar. ${detalhes}`;
        });
        //imprimindo a mensagem de erro
    } catch (erro) {
      this.mensagem = `Erro ao logar. Detalhes: ${erro}`;
    }
  }

  //recuperar senhas (enviando email para nova senha)
  async enviaLink() {

    //propriedades para exibição do popup (fire lança alert com base nas configs das propriedades informadas)
    const { value: email } = await Swal.fire({
      title: 'Informe o email cadastrado',
      input: 'email',
      inputPlaceholder: 'email'
    })
    //verificar se o campo email foi preenchido
    if (email) {
      this.authServ.resetPassword(email)
        .then(() => {
          this.emailEnviado = true;
          this.mensagem = `Email enviado para ${email} com instruções para recuperação.`
        })
        .catch(erro => {
          this.mensagem = `Erro ao localizar o email. Detahes ${erro.message}`
        })
    }
  }
}
