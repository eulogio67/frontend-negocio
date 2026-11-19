import api from '../api/axios';

export interface LineaPedido {
  nombre: string;
  talla: string;
  cantidad: number;
  precioUnitario: number;
}

export interface Pedido {
  id: number;
  clienteEmail: string;
  clienteTelefono: string;
  estado: 'PENDIENTE_PAGO' | 'CONFIRMADO' | 'CANCELADO';
  total: number;
  creado: string;
  items: LineaPedido[];
}

export const pedidoService = {
  crear: async (): Promise<Pedido> => (await api.post('/api/pedidos')).data,

  // Admin
  listarPendientes: async (): Promise<Pedido[]> =>
    (await api.get('/api/admin/pedidos', { params: { estado: 'PENDIENTE_PAGO' } })).data,
  confirmar: async (id: number): Promise<Pedido> =>
    (await api.post(`/api/admin/pedidos/${id}/confirmar`)).data,

  rechazar: async (id: number): Promise<Pedido> =>
  (await api.post(`/api/admin/pedidos/${id}/rechazar`)).data,
};