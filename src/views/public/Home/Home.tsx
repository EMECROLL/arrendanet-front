import { Button } from "primereact/button"
import { Card } from "primereact/card"
import "./CustomHero.css";
import { Accordion, AccordionTab } from "primereact/accordion";

function Home() {
  return (
    <main className="font-Nunito">
      <section className="flex flex-col justify-center min-h-[600px] hero p-10">
        <h1 className="font-Nunito text-4xl text-center font-bold text-white my-0">Simplifica la gestión de tus propiedades con una plataforma todo-en-uno.</h1>
        <h2 className="text-white font-Nunito text-2xl font-light text-center my-0">Conectamos a propietarios, encargados e inquilinos en una plataforma eficiente y segura.</h2>
        <div className="flex justify-content-center gap-2 my-5">
          <Button label="Conocer más" />
          <Button label="Entrar" />
        </div>
      </section>
      <section className="p-10">
        <h1 className="text-navy text-center font-bold text-4xl mb-10">¿Por qué elegirnos?</h1>
        <div className="flex justify-between">
          <Card title="Gestión simplificada" header={<><img src="/src/assets/images/porque_1.jpg" alt="" /></>} className="md:w-25rem">
            <p className="m-0">
              Nuestra plataforma te permite administrar todas tus propiedades en un solo lugar, desde contratos hasta mantenimiento, con la seguridad de una experiencia confiable y transparente para propietarios e inquilinos.
            </p>
          </Card>
          <Card title="Gestión segura y eficiente" header={<><img src="/src/assets/images/porque_2.jpg" alt="" /></>} className="md:w-25rem">
            <p className="m-0">
              Evita complicaciones y optimiza tu tiempo. Ofrecemos una solución integral para que lleves el control total de tus arrendamientos, facilitando la comunicación y el seguimiento desde cualquier lugar.
            </p>
          </Card>
          <Card title="Una Plataforma todo en uno" header={<><img src="/src/assets/images/porque_3.jpg" alt="" /></>} className="md:w-25rem">
            <p className="m-0">
              Controla cada detalle de tus inmuebles y mejora la experiencia de tus inquilinos con una plataforma que combina tecnología y responsabilidad. Simplifica el proceso y mantén tus propiedades en las mejores condiciones con nuestro soporte completo.
            </p>
          </Card>
        </div>
      </section>
      <section className="p-10">
        <h1 className="text-navy text-center font-bold text-4xl mb-10">Características</h1>
        <div className="grid grid-cols-2 gap-20 text-center">
          <Card title="Gestión Completa de Contratos" className="w-64 mx-auto">
            <p className="m-0">
              Crea, almacena y renueva contratos de arrendamiento en minutos. Simplifica el proceso y mantén todo en orden desde cualquier dispositivo.
            </p>
          </Card>
          <Card title="Seguimiento de Mantenimiento" className="w-64 mx-auto">
            <p className="m-0">
              Controla las solicitudes de mantenimiento y asegúrate de que cada propiedad se encuentre en las mejores condiciones, con notificaciones para cada actualización.
            </p>
          </Card>
          <Card title="Comunicación en Tiempo Real" className="w-64 mx-auto">
            <p className="m-0">
              Mantente en contacto directo con propietarios, administradores e inquilinos. Facilita la comunicación y resuelve dudas sin intermediarios ni demoras.
            </p>
          </Card>
          <Card title="Reportes Financieros" className="w-64 mx-auto">
            <p className="m-0">
              Accede a reportes detallados sobre ingresos, gastos y pagos pendientes. Toma decisiones informadas con una vista clara de tus finanzas.
            </p>
          </Card>
        </div>
      </section>
      <section className="p-10">
        <h1 className="text-navy text-center font-bold text-4xl mb-10">Preguntas frecuentes</h1>
        <Accordion activeIndex={0}>
          <AccordionTab header="¿La plataforma permite la comunicación con los inquilinos?">
            <p className="m-0">
              Sí, incluye un sistema de mensajería directa para mantenerte en contacto con inquilinos y administradores en tiempo real.
            </p>
          </AccordionTab>
          <AccordionTab header="¿Qué sucede si un inquilino se retrasa en el pago?">
            <p className="m-0">
              La plataforma envía recordatorios automáticos a los inquilinos y notificaciones a los propietarios para que ambos estén informados sobre cualquier atraso.
            </p>
          </AccordionTab>
          <AccordionTab header="¿Es necesario descargar alguna aplicación?">
            <p className="m-0">
              No, nuestra plataforma es 100% en línea, así que puedes acceder a ella desde cualquier dispositivo con internet.
            </p>
          </AccordionTab>
          <AccordionTab header="¿Es fácil de usar la plataforma?">
            <p className="m-0">
              Sí, hemos diseñado la plataforma para que sea intuitiva y fácil de usar, sin importar tu experiencia en tecnología.            </p>
          </AccordionTab>
          <AccordionTab header="¿Cuánto cuesta usar la plataforma?">
            <p className="m-0">
              Ofrecemos varios planes de precios según tus necesidades. Puedes consultar nuestros planes en la página de precios.            </p>
          </AccordionTab>
        </Accordion>
      </section>
    </main>
  )
}

export default Home