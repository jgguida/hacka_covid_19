/* Sensor de batimentos cardíacos e saturação de Oxigênio
 * Baseado no exemplo MAX30100_RawData da biblioteca
 * MAX30100lib para Arduino
 */

#include <Wire.h> 


#include "MAX30100.h" // Inclusão da biblioteca do sensor "MAX30100lib by Oxullo Intersecans" 
                      //(é necessário incluir também no menu "Sketch" >> "Incluir Biblioteca" >> "Gerenciar bibliotecas")
#include <math.h>

// Tweakable parameters
// Sampling and polling frequency must be set consistently
#define POLL_PERIOD_US                      1E06 / 100
#define SAMPLING_RATE                       MAX30100_SAMPRATE_100HZ

// The LEDs currents must be set to a level that avoids clipping and maximises the
// dynamic range
//Ajuste de corrente do LED IR:
//#define IR_LED_CURRENT                      MAX30100_LED_CURR_50MA
//#define IR_LED_CURRENT                      MAX30100_LED_CURR_11MA
#define IR_LED_CURRENT                      MAX30100_LED_CURR_0MA
//Ajuste de corrente do Led Vermelho:
//#define RED_LED_CURRENT                     MAX30100_LED_CURR_27_1MA
#define RED_LED_CURRENT                     MAX30100_LED_CURR_14_2MA
//#define RED_LED_CURRENT                     MAX30100_LED_CURR_0MA

// The pulse width of the LEDs driving determines the resolution of
// the ADC (which is a Sigma-Delta).
// set HIGHRES_MODE to true only when setting PULSE_WIDTH to MAX30100_SPC_PW_1600US_16BITS
#define PULSE_WIDTH                         MAX30100_SPC_PW_1600US_16BITS
#define HIGHRES_MODE                        true
#define led LED_BUILTIN
// Instantiate a MAX30100 sensor class
MAX30100 sensor;
uint32_t tsLastPollUs = 0;
/////Variáveis para controle da corrente:

unsigned long ir_medio=0;
unsigned long vm_medio=0;
unsigned long ir_premedio=0;
unsigned long vm_premedio=0;
unsigned int valor_ir;
unsigned int valor_vm;
unsigned int corrente_vm=7;
unsigned int corrente_ir=7;
unsigned long periodo_reajuste=100; // a cada 100ms o valor menor é aumentado e o maior é diminuido
unsigned long periodo_corrente=625; // a cada 625ms 0 valor da corrente é verificado

///////////////////////Variáveis para a leitura do batimento e oximetria////////////////////////////
unsigned int saturacao=0;
unsigned int saturathing=0;
unsigned int batimentos=0;
unsigned int periodo=0;
unsigned int templed=0;
boolean maior=false;
boolean menor=true;


word maior_ir=0;
word menor_ir=0;
word maior_vm=0;
word menor_vm=0;
word ir_ant=0;
word vm_ant=0;
word media_ir=0;
word ir_normalizado=0;
word ir_medio_normalizado=0;
word vm_normalizado=0;
word vm_medio_normalizado=0;
unsigned long ir_medio_filtrado=0;
unsigned int vetor_batimentos[20];
unsigned int indice_bat=0;
unsigned int vetor_spo2[100];
unsigned int ind_spo2;
unsigned long spo2_filtrado;

float coeficiente=0;
boolean ir_descendo=false;
boolean ir_subindo=true;
boolean vm_descendo=false;
boolean vm_subindo=true;

void setup()
{

  Serial.begin(115200);
    if (!sensor.begin()) 
    {
        Serial.println("O sensor não está respondendo");
        for(;;);
    } 
    pinMode(led, OUTPUT);
    // Set up the wanted parameters
    sensor.setMode(MAX30100_MODE_SPO2_HR);
    sensor.setLedsCurrent(IR_LED_CURRENT, RED_LED_CURRENT);
    sensor.setLedsPulseWidth(PULSE_WIDTH);
    sensor.setSamplingRate(SAMPLING_RATE);
    sensor.setHighresModeEnabled(HIGHRES_MODE);
    for (int i=0; i<=100; i++)
    {
      vetor_spo2[i]=98;
    }
    for (int i=0; i<=9; i++)
    {
      vetor_batimentos[i]=100;
    }    
}
void ajusta_corrente(void)
{
  corrente_ir=5; //ajusta a corrente do led IR de 0 a 15
  corrente_vm=9; //ajusta a corrente do led vermelho de 0 a 15
  sensor.setLedsCurrent((LEDCurrent)corrente_ir, (LEDCurrent)corrente_vm); //Envia o comando de ajuste de corrente para o sensor
}

void loop()
{
    // Using this construct instead of a delay allows to account for the time
    // spent sending data thru the serial and tighten the timings with the sampling
    if (micros() < tsLastPollUs || micros() - tsLastPollUs > 20000)//POLL_PERIOD_US) 
    {
        sensor.update();
        tsLastPollUs = micros();
        ir_ant=valor_ir;
        vm_ant=valor_vm;
        sensor.getRawValues(&valor_ir, &valor_vm);
       
//////////////////Detecção de bordas do infra-vermelho//////////////////////////////////
        if (valor_ir+20 < ir_ant)  // (d_ir/dt < 0) sinal diminuindo (+20 para ter certeza)
          {
            if(ir_subindo==true){maior_ir=ir_ant; ir_subindo=false;ir_descendo=true;}
          }
          
        if (valor_ir > ir_ant+20)  // (d_ir/dt > 0) sinal crescendo (+20 para ter certeza)
          {
            if(ir_descendo==true){menor_ir=ir_ant; ir_descendo=false;ir_subindo=true;}
          }

//////////////////Detecção de bordas do vermelho///////////////////////////////////////      
        if (valor_vm+20 < vm_ant) // (d_vm/dt < 0) sinal diminuindo (+20 para ter certeza)
          {
            if(vm_subindo==true){maior_vm = vm_ant; vm_subindo=false;  vm_descendo=true;}
          }
          
        if (valor_vm > vm_ant+20)  // (d_vm/dt > 0) sinal crescendo (+20 para ter certeza)
          {
            if(vm_descendo==true){menor_vm = vm_ant; vm_descendo=false; vm_subindo=true;}
          }

          if (maior_ir > menor_ir) {media_ir = (maior_ir-menor_ir)/2+menor_ir;}

    
/////////////////////////////////Remoção da DC para oximetria////////////////////////////////////
        if (valor_ir>=menor_ir){ir_normalizado=valor_ir-menor_ir;}
        if (valor_vm>=menor_vm){vm_normalizado=valor_vm-menor_vm;}
        
////////////////////////////////////// Valores médios/////////////////////////////////////////////
        if (maior_ir>menor_ir && (maior_ir-menor_ir)>=2){ir_medio_normalizado=(maior_ir-menor_ir)/2;}
        if (maior_vm>menor_vm && (maior_vm-menor_vm)>=2){vm_medio_normalizado=(maior_vm-menor_vm)/2;}


/////////   Caso os valores extrapolem muito, essas linhas trazem os valores    ////////////////////
/////////   para mais próximo do padrão visando acelerar o processo  ///////////////////////////////

        if (vm_normalizado>3000){vm_normalizado=1000;}
        if (ir_normalizado>2500){ir_normalizado=1200;}
        if (vm_medio_normalizado>3000){vm_medio_normalizado=1000;}
        if (ir_medio_normalizado>1500){ir_medio_normalizado=600;}

//Arduíno Plotter Serial



        Serial.print(maior_ir);Serial.print(",");Serial.print(menor_ir);Serial.print(",");
        Serial.print(maior_vm); Serial.print(","); Serial.print(menor_vm); Serial.print(",");
        Serial.print(valor_ir); Serial.print(","); 
        Serial.print(valor_vm); //Serial.print(",");      
        Serial.print(media_ir);Serial.print(",");

//////////////////Imprime valores normalizados(DC removida) com as médias instantâneas/////////////////

        Serial.print(ir_normalizado); Serial.print(","); Serial.print(ir_medio_normalizado);
        Serial.print(",");
        Serial.print(vm_normalizado); Serial.print(","); Serial.print(vm_medio_normalizado); 
        
//////////////////////////////////Retorno de linha obrigatório para o plotter serial//////////////////        
        Serial.println("");

        //A rotina a seguir detecta os batimentos cardíacos
        if (valor_ir > media_ir && valor_ir > 10000 && !maior)
          {
            maior=true;
            templed=millis();
            digitalWrite(led,HIGH);
            periodo=millis()-periodo;
            vetor_batimentos[indice_bat]=60000/periodo;
            periodo=millis();
            for(int i=0;i<=9;i++)
            {
              batimentos=batimentos+vetor_batimentos[i];
            }
            batimentos = batimentos / 10;
            indice_bat++;
            if (indice_bat > 9){indice_bat=0;}

            vetor_spo2[ind_spo2]=saturacao; //A cada medição, eu vou preenchendo um vetor de 20 posições
            ind_spo2++;
            if (ind_spo2>19){ind_spo2=0;}
            for (int i=0; i<=19; i++)
            {
              spo2_filtrado=spo2_filtrado+vetor_spo2[i];
            }
            spo2_filtrado=spo2_filtrado/20;
            if (spo2_filtrado>100){spo2_filtrado=100;}
          }
          
         if (valor_ir < media_ir && maior && (millis()-periodo) > 170)
          {
            maior=false;
            //As Três linhas abaixo imprimem o valor dos batimentos cardíacos e a saturação de oxigênio, a saturação 
            // ainda não está percisa.
            Serial.print("SpO2 = "); Serial.print(spo2_filtrado); Serial.print("%");
            Serial.print("    Pulso = "); Serial.print(batimentos); Serial.print("bpm   ");
            Serial.println(""); */
          }


/////////////////////////Filtro de média para a medição de Spo2////////////////////////////

          saturacao =107 * (log10(vm_medio_normalizado)/log10(ir_medio_normalizado));          
          if (saturacao>100) {saturacao=100;}
          vetor_spo2[ind_spo2]=saturacao;
          ind_spo2++;                     
          if (ind_spo2>99){ind_spo2=0;}
          for (int i=0; i<=99; i++)  // A cada novo valor incluido no vetor, eu tiro a média dos valores contidos no vetor
          {
            spo2_filtrado=spo2_filtrado+vetor_spo2[i];
          }
          spo2_filtrado=spo2_filtrado/100;
          ajusta_corrente();
    }

    if (millis()-templed>=50)
    {
      digitalWrite(led,LOW); 
                              
    }                                                      
}
