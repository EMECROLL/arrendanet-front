import { Card } from "primereact/card"
import { Accordion, AccordionTab } from "primereact/accordion";
import { useRef } from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Fieldset } from 'primereact/fieldset';
import { Avatar } from "primereact/avatar";

const legendTemplate = (nombre: string, img: string) => (
  <div className="flex align-items-center gap-2 px-2">
    <Avatar image={`src/assets/icons/equipo/${img}`} shape="circle" />
    <span className="font-bold">{nombre}</span>
  </div>
);

export default function SobreNostros() {
  const stepperRef = useRef(null);


  return (
    <main className="font-Nunito">
      <section className="flex flex-col justify-center p-10">
        <h1 className="font-Nunito text-4xl text-center font-bold text-navy my-0">Sobre Nosotros</h1>
        <h2 className="text-navy font-Nunito text-2xl font-light text-center my-0">Transformamos la gestión de propiedades en una experiencia sencilla y eficiente para todos.</h2>
      </section>
      <section className="px-10">
        <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }}>
          <StepperPanel header="Nuestra Historia">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex flex-col justify-content-center align-items-center font-medium text-center">
                <h1 className="pt-3 m-0">Nuestra Historia</h1>
                <p className="p-3 w-5/6">Todo comenzó en 2024 cuando un grupo de emprendedores con experiencia en el sector inmobiliario y en tecnología decidió crear una plataforma para resolver un problema común: la complejidad de administrar propiedades de manera eficiente y segura. Con una visión clara de cómo la tecnología podía mejorar la vida de propietarios, inquilinos y administradores, lanzamos nuestra plataforma. Hoy, somos un referente en el sector, ofreciendo un servicio que evoluciona constantemente para adaptarse a las necesidades de nuestros usuarios. Creemos que la innovación y la cercanía son las claves para transformar la experiencia de la administración de propiedades.</p>
              </div>
            </div>
            <div className="flex pt-14 justify-content-end">
              <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
            </div>
          </StepperPanel>
          <StepperPanel header="Nuestra Misión">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex flex-col justify-content-center align-items-center font-medium text-center">
                <h1 className="pt-3 m-0">Nuestra misión</h1>
                <p className="p-3 w-5/6">Facilitamos la vida de propietarios, administradores e inquilinos a través de una plataforma que simplifica la gestión de propiedades. Nos comprometemos a crear un espacio seguro, transparente y eficiente donde todos los involucrados puedan comunicarse, realizar pagos, gestionar contratos y solicitar servicios sin complicaciones. Nuestro enfoque se centra en la satisfacción y la tranquilidad de nuestros usuarios, permitiéndoles gestionar sus propiedades de manera integral y en tiempo real.</p>
              </div>
            </div>
            <div className="flex pt-6 justify-content-between">
              <Button label="Volver" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
              <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
            </div>
          </StepperPanel>
          <StepperPanel header="Nuestra Visión">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex flex-col justify-content-center align-items-center font-medium text-center">
                <h1 className="pt-3 m-0">Nuestra Visión</h1>
                <p className="p-3 w-5/6">Ser la plataforma de referencia en la gestión de propiedades en Latinoamérica, liderando el mercado a través de la innovación y la excelencia en el servicio. Aspiramos a ser un puente de confianza entre propietarios e inquilinos, ofreciendo una experiencia de usuario que haga que la administración de propiedades sea tan sencilla como efectiva. Nos visualizamos como pioneros en soluciones tecnológicas que realmente marquen la diferencia en la vida de nuestros usuarios, permitiéndoles tomar el control de sus bienes de manera simple y segura.</p>
              </div>
            </div>
            <div className="flex pt-6 justify-content-between">
              <Button label="Volver" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
              <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
            </div>
          </StepperPanel>
          <StepperPanel header="Nuestros Valores">
            <div className="flex flex-column h-12rem">
              <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex flex-col justify-content-center align-items-center font-medium text-center">
                <h1 className="pt-3 m-0 mb-5">Nuestros Valores</h1>
                <div className="grid grid-cols-2 gap-5 text-center pb-5">
                  <Card title="Transparencia" className="w-64">
                    <p className="m-0">
                      Fomentamos la confianza a través de una comunicación clara y abierta en cada paso.
                    </p>
                  </Card>
                  <Card title="Innovación" className="w-64">
                    <p className="m-0">
                      Utilizamos tecnología de punta para mejorar la experiencia de nuestros usuarios.
                    </p>
                  </Card>
                  <Card title="Compromiso" className="w-64">
                    <p className="m-0">
                      Nos dedicamos a ofrecer excelencia en todos nuestros servicios.
                    </p>
                  </Card>
                  <Card title="Responsabilidad" className="w-64">
                    <p className="m-0">
                      Actuamos con integridad y profesionalismo en todas nuestras operaciones.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
            <div className="flex pt-32 justify-content-start">
              <Button label="Volver" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
            </div>
          </StepperPanel>
        </Stepper>
      </section>
      <Divider />
      <section className="p-10">
        <div className="mb-12 w-2/3 mx-auto">
          <h1 className="text-navy text-center font-bold text-4xl m-0">Conoce a nuestro equipo</h1>
          <p className="font-medium text-lg text-center">Detrás de nuestra plataforma hay un equipo apasionado y comprometido. Cada miembro aporta su experiencia y talento en tecnología, atención al cliente y gestión inmobiliaria para ofrecerte un servicio de excelencia. Nos enorgullece contar con personas que comparten nuestra misión de hacer que la gestión de propiedades sea una experiencia más humana y accesible.</p>
        </div>
        <div className="grid grid-cols-2 gap-x-20 gap-y-10 text-center">
          <div className="card mx-auto">
            <Fieldset legend={legendTemplate("Kevin Bello", "Kevin.png")} className="w-96 pt-0">
              <h1 className="m-0 text-xl font-semibold">CEO</h1>
              <p className="m-0">
                Con más de 10 años de experiencia en tecnología, Carlos lidera con visión y pasión, siempre buscando nuevas formas de innovar.
              </p>
            </Fieldset>
          </div>
          <div className="card mx-auto">
            <Fieldset legend={legendTemplate("Luis Gomez", "Luis.png")} className="w-96 pt-0">
              <h1 className="m-0 text-xl font-semibold">Director de producto</h1>
              <p className="m-0">
                Luis se encarga de asegurar que cada funcionalidad de la plataforma cumpla con las expectativas de nuestros usuarios y aporte valor real.
              </p>
            </Fieldset>
          </div>
          <div className="card mx-auto">
            <Fieldset legend={legendTemplate("Manuel Pasos", "Manuel.png")} className="w-96 pt-0">
              <h1 className="m-0 text-xl font-semibold">Director de tecnología</h1>
              <p className="m-0">
                Con un enfoque en el desarrollo y la mejora continua, Manuel lidera el equipo técnico, garantizando que nuestra infraestructura sea segura y eficiente.
              </p>
            </Fieldset>
          </div>
          <div className="card mx-auto">
            <Fieldset legend={legendTemplate("Misael Rosado", "Misael.png")} className="w-96 pt-0">
              <h1 className="m-0 text-xl font-semibold">Gerente de soporte al cliente</h1>
              <p className="m-0">
                Misael se dedica a brindar un servicio al cliente excepcional, ayudando a resolver cualquier duda o problema que puedan tener nuestros usuarios.
              </p>
            </Fieldset>
          </div>
        </div>
      </section>
    </main>
  )
}
