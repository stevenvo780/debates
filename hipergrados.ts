interface NodoInterface {
  memoria: Memoria;
}

interface Memoria {
  propiedades: number[];
  edad: number;
  subMemoria: NodoInterface[];
  procesos: Procesos;
  relacion: NodoInterface[];
}

interface Procesos {
  materiaEntrante: (nodo: NodoInterface, propiedad: number) => number;
  cambioDeEstado: (nodo: NodoInterface, propiedad: number) => number;
  materiaSaliente: (index: number) => number;
  relacionar: (nodo: NodoInterface) => NodoInterface;
}

const filas = 50;
const columnas = 80;

const materiaEntrante = (nodo: NodoInterface, propiedad: number): number => {
  nodo.memoria.propiedades.push(propiedad);
  return nodo.memoria.propiedades.length;
};

const cambioDeEstado = (nodo: NodoInterface, propiedad: number): number => {
  nodo.memoria.propiedades.push(propiedad);
  return propiedad + 1;
};

const relacionar = (nodo: NodoInterface): NodoInterface => {
  nodo.memoria.relacion.push(nodo);
  return nodo;
};

const materiaSaliente = (index: number): number => {
  nodos.splice(index, 1);
  return nodos.length;
};

const nodos: NodoInterface[] = [];

const determinacionesDelSistema = () => {
  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      const nodo: NodoInterface = {
        memoria: {
          propiedades: [Math.random() > 0.5 ? 1 : 0], // Ajustar la probabilidad de vida inicial
          edad: 0,
          subMemoria: [],
          procesos: {
            materiaEntrante,
            cambioDeEstado,
            materiaSaliente,
            relacionar,
          },
          relacion: [],
        },
      };
      nodos.push(nodo);
    }
  }
};

const procesoDeAlimentacion = (nodo: NodoInterface, vecinosVivos: number) => {
  if (nodo.memoria.propiedades[0] === 1) {
    nodo.memoria.edad++;
    if (vecinosVivos < 2 || vecinosVivos > 3 || nodo.memoria.edad > 10) {
      nodo.memoria.propiedades[0] = 0;
      nodo.memoria.edad = 0;
    }
  } else {
    if (vecinosVivos === 3) {
      nodo.memoria.propiedades[0] = 1;
      nodo.memoria.edad = 1;
    }
  }
};

const vecinosVivos = (i: number, j: number) => {
  const vecinos = [
    nodos[((i - 1 + filas) % filas) * columnas + ((j - 1 + columnas) % columnas)]?.memoria.propiedades[0] ?? 0,
    nodos[((i - 1 + filas) % filas) * columnas + j]?.memoria.propiedades[0] ?? 0,
    nodos[((i - 1 + filas) % filas) * columnas + ((j + 1) % columnas)]?.memoria.propiedades[0] ?? 0,
    nodos[i * columnas + ((j - 1 + columnas) % columnas)]?.memoria.propiedades[0] ?? 0,
    nodos[i * columnas + ((j + 1) % columnas)]?.memoria.propiedades[0] ?? 0,
    nodos[((i + 1) % filas) * columnas + ((j - 1 + columnas) % columnas)]?.memoria.propiedades[0] ?? 0,
    nodos[((i + 1) % filas) * columnas + (j)]?.memoria.propiedades[0] ?? 0,
    nodos[((i + 1) % filas) * columnas + ((j + 1) % columnas)]?.memoria.propiedades[0] ?? 0,
  ];
  return vecinos.reduce((a, b) => a + b);
};

const siguienteGeneracion = () => {
  const nuevaGeneracion: NodoInterface[] = nodos.map((nodo) => ({ ...nodo, memoria: { ...nodo.memoria, propiedades: [...nodo.memoria.propiedades] } }));
  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      const totalVecinosVivos = vecinosVivos(i, j);
      procesoDeAlimentacion(nuevaGeneracion[i * columnas + j], totalVecinosVivos);
    }
  }
  nodos.length = 0;
  nodos.push(...nuevaGeneracion);
};

const imprimirCuadricula = () => {
  for (let i = 0; i < filas; i++) {
    let fila = '';
    for (let j = 0; j < columnas; j++) {
      const nodo = nodos[i * columnas + j];
      if (nodo.memoria.propiedades[0] === 1) {
        if (nodo.memoria.edad < 2) {
          fila += '• '; // Célula joven
        } else if (nodo.memoria.edad < 5) {
          fila += '○ '; // Célula adulta
        } else {
          fila += '● '; // Célula anciana
        }
      } else {
        fila += '  '; // Espacio vacío
      }
    }
    console.log(fila);
  }
  console.log('\n');
};

const bigBang = () => {
  determinacionesDelSistema();
  imprimirCuadricula();

  setInterval(() => {
    siguienteGeneracion();
    imprimirCuadricula();
  }, 500);
};

bigBang();
