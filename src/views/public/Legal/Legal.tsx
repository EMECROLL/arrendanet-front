import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { useRef } from 'react';

export default function Legal() {
  const stepperRef = useRef(null);

  return (
    <main>
      <section className="flex flex-col justify-center p-6 sm:p-10">
        <h1 className="font-Nunito text-3xl sm:text-4xl text-center font-bold text-navy my-0">Aspectos legales</h1>
        <h2 className="text-navy font-Nunito text-lg sm:text-xl font-light text-center my-0 w-full sm:w-10/12 mx-auto">
          En esta sección encontrarás todos los términos y condiciones que rigen el uso de nuestra plataforma, así como nuestra política de privacidad, cookies, devoluciones y más. Te invitamos a leer detenidamente cada uno de los documentos para comprender cómo protegemos tus datos, tus derechos y nuestras responsabilidades.
        </h2>
      </section>
      <div className="card flex justify-content-center w-full sm:w-3/4 mx-auto">
        <Stepper ref={stepperRef} style={{ width: '100%' }}>
          <StepperPanel header="Política de Privacidad">
            <div className="flex flex-col">
              <div className="border-2 p-4 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <div>
                  <h1>Política de Privacidad</h1>

                  <h3>Introducción</h3>
                  <p>En ArrendaNet nos comprometemos a proteger tu privacidad. Esta Política de Privacidad explica cómo recopilamos, utilizamos y protegemos la información personal que proporcionas al utilizar nuestra plataforma. Al acceder o utilizar nuestros servicios, aceptas las prácticas descritas en esta política.</p>

                  <h3>Información que Recopilamos</h3>
                  <p>Recopilamos la siguiente información:</p>
                  <ul>
                    <li>Información Personal: Nombre, dirección de correo electrónico, dirección postal, número de teléfono, y otros detalles de contacto.</li>
                    <li>Información de Uso: Datos sobre cómo utilizas nuestra plataforma, incluyendo direcciones IP, tipo de dispositivo, y comportamiento en la web.</li>
                    <li>Información de Pago: Si realizas pagos a través de nuestra plataforma, recopilamos la información de facturación y pagos.</li>
                  </ul>

                  <h3>Uso de la Información</h3>
                  <ul>
                    <li>Proveer nuestros servicios y mejorar la experiencia de usuario.</li>
                    <li>Procesar transacciones y gestionar tus pagos.</li>
                    <li>Comunicarnos contigo sobre actualizaciones o cambios en nuestros servicios.</li>
                    <li>Prevenir fraudes y mantener la seguridad de la plataforma.</li>
                    <li>Mejorar nuestros productos y servicios mediante el análisis de la información de uso.</li>
                  </ul>

                  <h3>Protección de la Información</h3>
                  <p>Tomamos medidas de seguridad adecuadas para proteger tu información personal. Sin embargo, ninguna transmisión de datos por internet es completamente segura, por lo que no podemos garantizar la seguridad absoluta.</p>

                  <h3>Compartir Información</h3>
                  <p>No vendemos ni alquilamos tu información personal. Sin embargo, podemos compartirla con terceros proveedores de servicios que nos ayudan a operar nuestra plataforma, siempre bajo estrictos acuerdos de privacidad.</p>

                  <h3>Tus Derechos</h3>
                  <p>Tienes el derecho a acceder, corregir, o eliminar tu información personal. Puedes hacerlo accediendo a tu cuenta o contactándonos directamente.</p>

                  <h3>Cambios en la Política</h3>
                  <p>Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos sobre cambios importantes, pero te recomendamos revisar esta política regularmente.</p>
                </div>
              </div>
            </div>
            <div className="flex pt-4 justify-content-end">
              <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
            </div>
          </StepperPanel>

          {/* Other Stepper Panels (Términos y Condiciones, Política de Cookies) */}

          <StepperPanel header="Términos y Condiciones">
            <div className="flex flex-col">
              <div className="border-2 p-4 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                <div>
                  <h1>Términos y Condiciones</h1>
                  <h3>Introducción</h3>
                  <p>Los siguientes términos y condiciones gobiernan el uso de nuestra plataforma. Al acceder o utilizar nuestros servicios, aceptas estos términos. Si no estás de acuerdo con estos términos, no utilices nuestros servicios.</p>

                  <h3>Uso del Servicio</h3>
                  <p><strong>Registro:</strong> Para usar nuestra plataforma, debes registrarte proporcionando información precisa y completa.</p>
                  <p><strong>Responsabilidad del Usuario:</strong> Eres responsable de mantener la confidencialidad de tu cuenta y de todas las actividades realizadas bajo tu cuenta.</p>
                  <p><strong>Comportamiento Aceptable:</strong> No debes utilizar nuestra plataforma para actividades ilegales o no autorizadas.</p>

                  <h3>Propiedad Intelectual</h3>
                  <p>Todo el contenido de la plataforma es propiedad de ArrendaNet o sus licenciantes y está protegido por leyes de propiedad intelectual.</p>

                  <h3>Limitación de Responsabilidad</h3>
                  <p>ArrendaNet no será responsable de daños directos, indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de usar la plataforma.</p>

                  <h3>Modificaciones</h3>
                  <p>Podemos modificar estos Términos y Condiciones en cualquier momento. Te notificaremos sobre los cambios significativos, pero te recomendamos revisarlos regularmente.</p>

                  <h3>Ley Aplicable</h3>
                  <p>Estos Términos y Condiciones se regirán por las leyes de México. Cualquier disputa será resuelta en los tribunales de Quintana Roo.</p>
                </div>
              </div>
            </div>
            <div className="flex pt-4 justify-content-between">
              <Button label="Volver" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
              <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
            </div>
          </StepperPanel>
          <StepperPanel header="Política de Cookies">
            <div className="flex flex-col">
              <div className="border-2 p-4 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
              <div>
                  <h1>Política de Cookies</h1>
                  <h3>Introducción</h3>
                  <p>En ArrendaNet utilizamos cookies para mejorar tu experiencia en nuestra plataforma. Esta Política de Cookies explica qué son las cookies, cómo las utilizamos y cómo puedes controlarlas.</p>

                  <h3>¿Qué son las Cookies?</h3>
                  <p>
                    Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestra plataforma. Las cookies permiten que nuestro sitio web recuerde tus acciones y preferencias durante un periodo de tiempo, para que no tengas que volver a ingresarlas cada vez que regreses.
                  </p>

                  <h3>Tipos de Cookies que Utilizamos</h3>
                  <p><strong>Cookies Esenciales:</strong> Son necesarias para que nuestra plataforma funcione correctamente. Sin ellas, algunas funciones de la plataforma no estarán disponibles.</p>
                  <p><strong>Cookies de Rendimiento:</strong> Recopilan información sobre cómo los usuarios navegan en nuestra plataforma, lo que nos permite mejorar el funcionamiento del sitio.</p>
                  <p><strong>Cookies Funcionales:</strong> Permiten que nuestra plataforma recuerde tus preferencias, como el idioma o el país, para ofrecerte una experiencia más personalizada.</p>
                  <p><strong>Cookies de Publicidad:</strong> Se utilizan para mostrarte anuncios relevantes basados en tu historial de navegación.</p>


                  <h3>Cómo Controlar las Cookies</h3>
                  <p>
                  Puedes gestionar o desactivar las cookies a través de la configuración de tu navegador. Sin embargo, ten en cuenta que si desactivas las cookies, algunas funciones de nuestra plataforma podrían no funcionar correctamente.
                  </p>

                  <h3>Cambios en la Política de Cookies</h3>
                  <p>
                    Podemos actualizar esta política de vez en cuando. Te notificaremos sobre los cambios importantes, pero te recomendamos revisar esta política con regularidad.
                  </p>

                </div>
              </div>
            </div>
            <div className="flex pt-4 justify-content-start">
              <Button label="Volver" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
            </div>
          </StepperPanel>
        </Stepper>
      </div>
    </main>
  )
}
