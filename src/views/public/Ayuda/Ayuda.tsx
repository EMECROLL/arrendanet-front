import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useState } from 'react';

export default function Ayuda() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  });
  const [cargando, setCargando] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    setTimeout(() => {
      setCargando(false);
      setVisible(true);
    }, 2000);
  };

  return (
    <main className="p-6 sm:p-10">
      <section className="flex flex-col justify-center px-4 sm:px-10 mb-10">
        <h1 className="text-3xl sm:text-4xl text-center font-bold text-navy my-0">¡Estamos aquí para ayudarte!</h1>
        <h2 className="text-navy text-lg sm:text-xl font-light text-center my-0 w-full sm:w-10/12 mx-auto">
          Un equipo de soporte listo para responder cualquier pregunta o consulta que puedas tener.
        </h2>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-10 rounded-xl shadow-xl p-4 sm:w-6/12 mx-auto border-2 border-azulFuerte">
          <h2 className="text-navy text-xl font-semibold text-center my-0 w-full sm:w-10/12 mx-auto">
            Formulario de contacto
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <FloatLabel>
                  <InputText id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
                  <label style={{ fontSize: '16px' }} htmlFor="nombre">
                    Nombre completo
                  </label>
                </FloatLabel>
              </div>

              <div className="flex flex-col">
                <FloatLabel>
                  <InputText id="correo" type="email" value={formData.correo} onChange={handleChange} />
                  <label style={{ fontSize: '16px' }} htmlFor="correo">
                    Correo electrónico
                  </label>
                </FloatLabel>
              </div>

              <div className="flex flex-col">
                <FloatLabel>
                  <InputText
                    className="w-full"
                    id="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                  <label style={{ fontSize: '16px' }} htmlFor="telefono">
                    Teléfono (Opcional)
                  </label>
                </FloatLabel>
              </div>

              <div className="flex flex-col">
                <FloatLabel>
                  <InputText className="w-full" id="asunto" type="tel" value={formData.asunto} onChange={handleChange} />
                  <label style={{ fontSize: '16px' }} htmlFor="asunto">
                    Asunto (Tema o motivo de contacto)
                  </label>
                </FloatLabel>
              </div>

              <div className="flex flex-col">
                <FloatLabel>
                  <InputTextarea className="w-full" id="mensaje" value={formData.mensaje} onChange={handleChange} />
                  <label style={{ fontSize: '16px' }} htmlFor="mensaje">
                    Mensaje
                  </label>
                </FloatLabel>
              </div>
            </div>

            <Button className="mx-auto w-full sm:w-1/2" label="Enviar" loading={cargando} type="submit" />
            <Dialog
              header="Mensaje enviado"
              visible={visible}
              style={{ width: '50vw' }}
              onHide={() => {
                if (!visible) return;
                setVisible(false);
              }}
            >
              <p className="m-0">¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.</p>
            </Dialog>
          </form>
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-600">
              Recuerda que los datos que nos proporcionas serán tratados de acuerdo a nuestra{' '}
              <a href="/legal" target="_blank" className="text-blue-600 hover:underline">
                Política de Privacidad
              </a>
              .
            </p>
          </div>
        </div>

        <div className="space-y-10 rounded-xl shadow-xl p-4 sm:w-4/12 mx-auto border-2 border-azulFuerte">
          <h2 className="text-navy text-xl font-semibold text-center my-0 w-full sm:w-10/12 mx-auto">
            ¿Prefieres contactarnos directamente?
          </h2>
          <div className="flex justify-center flex-col mx-auto">
            <h1 className="font-semibold text-base">Dirección: <span className="font-normal">Carretera Cancún-Aeropuerto, S.M 299-Km. 11.5, 77565 Q.R.</span></h1>
            <h1 className="font-semibold text-base">Teléfono: <span className="font-normal">998XXXXXXX.</span></h1>
            <h1 className="font-semibold text-base">Correo Electrónico: <span className="font-normal">TirandoScript@gmail.com</span></h1>
            <h1 className="font-semibold text-base">Horario de Atención:
              <span className="font-normal">Lunes a Viernes: 9:00 AM - 6:00 PM Sábados: 10:00 AM - 2:00 PM</span>
            </h1>
            <img className="w-full sm:w-2/3 mx-auto" src="/src/assets/images/mapa.png" alt="Nuestra ubicación" />
          </div>
        </div>
      </section>
    </main>
  );
}
