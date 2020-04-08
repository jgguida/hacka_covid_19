import React from "react";
import HomeScreen from "./HomeScreen.js";
import Agendar from "../AgendaScreen/index.js";
import BeneficiaryScreen from "../BeneficiaryScreen/index.js";
import ServiceLocal from "../ServiceLocalScreen/index.js";
import Payment from "../PaymentScreen/index.js";
import Register from "../RegisterScreen/index.js";
import Perfil from "../PerfilScreen/index.js";
import Exames from "../ExamesScreen/index.js";
import SideBar from "../SideBar/SideBarEmpresarial.js";
import Change from "../ChangeUser/Change";


import Notificacoes from "../Notificacoes/Notificacoes.js";
import FaleConosco from "../FaleConosco/FaleConosco.js";

import { createDrawerNavigator } from "react-navigation";


const HomeScreenRouter = createDrawerNavigator(
  {
    'Início': { screen: HomeScreen },
    'Meu Perfil': { screen: Perfil, },
    'Carteirinha': { screen: BeneficiaryScreen, },
    'Rede de Atendimento': { screen: ServiceLocal },
    'Agendar': { screen: Agendar },
    'Autorizações': { screen: Exames, },
    'Fale Conosco': { screen: FaleConosco },
    'Minhas Faturas': { screen: Payment },
    'Meus Dados': { screen: Register },
    'Notificacoes': { screen: Notificacoes },
    'Trocar Pessoa': { screen: Change },
  },
  {
    unmountInactiveRoutes: true,
    contentComponent: props => <SideBar {...props } />    
  }
);
export default HomeScreenRouter;
