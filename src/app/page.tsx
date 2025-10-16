"use client"

import { useState, useEffect } from 'react'
import { Search, Car, User, Settings, Plus, Eye, MessageCircle, Filter, MapPin, Calendar, Gauge, DollarSign, Phone, Mail, Building, Users, BarChart3, Shield, Crown, Check, X, Menu, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Dados mockados
const mockVehicles = [
  {
    id: 1,
    marca: 'Toyota',
    modelo: 'Corolla',
    ano: 2020,
    km: 45000,
    preco: 85000,
    descricao: 'Veículo em excelente estado, revisões em dia, único dono.',
    fotos: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop'],
    loja: 'AutoCenter Palmas',
    cidade: 'Palmas',
    whatsapp: '63999887766',
    cnpj: '12345678000190'
  },
  {
    id: 2,
    marca: 'Honda',
    modelo: 'Civic',
    ano: 2019,
    km: 52000,
    preco: 78000,
    descricao: 'Sedan executivo, ar condicionado, direção hidráulica.',
    fotos: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop'],
    loja: 'Veículos Araguaína',
    cidade: 'Araguaína',
    whatsapp: '63988776655',
    cnpj: '98765432000110'
  },
  {
    id: 3,
    marca: 'Volkswagen',
    modelo: 'Jetta',
    ano: 2021,
    km: 28000,
    preco: 95000,
    descricao: 'Seminovo, garantia de fábrica, todas as revisões em concessionária.',
    fotos: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop'],
    loja: 'Premium Motors',
    cidade: 'Gurupi',
    whatsapp: '63977665544',
    cnpj: '11222333000144'
  }
]

// Base de usuários mockada para login/cadastro
let mockUsers = [
  {
    id: 1,
    nomeFantasia: 'AutoCenter Palmas',
    cnpj: '12345678000190',
    cidade: 'Palmas',
    whatsapp: '63999887766',
    email: 'contato@autocenterpalmas.com.br',
    senha: '123456',
    plano: 'premium',
    visualizacoes: 3
  },
  {
    id: 2,
    nomeFantasia: 'Veículos Araguaína',
    cnpj: '98765432000110',
    cidade: 'Araguaína',
    whatsapp: '63988776655',
    email: 'contato@veiculosaraguaina.com.br',
    senha: '123456',
    plano: 'gratuito',
    visualizacoes: 2
  }
]

const marcas = ['Toyota', 'Honda', 'Volkswagen', 'Ford', 'Chevrolet', 'Hyundai', 'Nissan', 'Fiat']
const cidades = ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional', 'Paraíso do Tocantins']

export default function RepassePro() {
  const [currentView, setCurrentView] = useState('home')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [vehicles, setVehicles] = useState(mockVehicles)
  const [filteredVehicles, setFilteredVehicles] = useState(mockVehicles)
  const [searchFilters, setSearchFilters] = useState({
    marca: '',
    precoMin: '',
    precoMax: '',
    anoMin: '',
    anoMax: ''
  })
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' ou 'register'
  const [loginData, setLoginData] = useState({ cnpj: '', senha: '' })
  const [registerData, setRegisterData] = useState({
    nomeFantasia: '',
    cnpj: '',
    cidade: '',
    whatsapp: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  })
  const [authError, setAuthError] = useState('')
  const [newVehicle, setNewVehicle] = useState({
    marca: '',
    modelo: '',
    ano: '',
    km: '',
    preco: '',
    descricao: '',
    fotos: ''
  })

  // Aplicar filtros
  useEffect(() => {
    let filtered = vehicles
    
    if (searchFilters.marca && searchFilters.marca !== 'todas') {
      filtered = filtered.filter(v => v.marca === searchFilters.marca)
    }
    if (searchFilters.precoMin) {
      filtered = filtered.filter(v => v.preco >= parseInt(searchFilters.precoMin))
    }
    if (searchFilters.precoMax) {
      filtered = filtered.filter(v => v.preco <= parseInt(searchFilters.precoMax))
    }
    if (searchFilters.anoMin) {
      filtered = filtered.filter(v => v.ano >= parseInt(searchFilters.anoMin))
    }
    if (searchFilters.anoMax) {
      filtered = filtered.filter(v => v.ano <= parseInt(searchFilters.anoMax))
    }
    
    setFilteredVehicles(filtered)
  }, [searchFilters, vehicles])

  // Validar CNPJ
  const validateCNPJ = (cnpj) => {
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '')
    return cleanCNPJ.length === 14
  }

  // Formatar CNPJ
  const formatCNPJInput = (value) => {
    const cleanValue = value.replace(/[^\d]/g, '')
    if (cleanValue.length <= 14) {
      return cleanValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
    return value
  }

  // Handle Login
  const handleLogin = () => {
    setAuthError('')
    
    if (!loginData.cnpj || !loginData.senha) {
      setAuthError('Por favor, preencha todos os campos.')
      return
    }

    const cleanCNPJ = loginData.cnpj.replace(/[^\d]/g, '')
    
    if (!validateCNPJ(cleanCNPJ)) {
      setAuthError('CNPJ deve ter 14 dígitos.')
      return
    }

    const foundUser = mockUsers.find(u => 
      u.cnpj === cleanCNPJ && u.senha === loginData.senha
    )

    if (foundUser) {
      setUser(foundUser)
      setIsLoggedIn(true)
      setCurrentView('home')
      setLoginData({ cnpj: '', senha: '' })
      setAuthError('')
    } else {
      setAuthError('CNPJ ou senha incorretos.')
    }
  }

  // Handle Register
  const handleRegister = () => {
    setAuthError('')
    
    // Validações
    if (!registerData.nomeFantasia || !registerData.cnpj || !registerData.cidade || 
        !registerData.whatsapp || !registerData.email || !registerData.senha || 
        !registerData.confirmarSenha) {
      setAuthError('Por favor, preencha todos os campos.')
      return
    }

    const cleanCNPJ = registerData.cnpj.replace(/[^\d]/g, '')
    
    if (!validateCNPJ(cleanCNPJ)) {
      setAuthError('CNPJ deve ter 14 dígitos.')
      return
    }

    if (registerData.senha !== registerData.confirmarSenha) {
      setAuthError('As senhas não coincidem.')
      return
    }

    if (registerData.senha.length < 6) {
      setAuthError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    // Verificar se CNPJ já existe
    const existingUser = mockUsers.find(u => u.cnpj === cleanCNPJ)
    if (existingUser) {
      setAuthError('CNPJ já cadastrado.')
      return
    }

    // Criar novo usuário
    const newUser = {
      id: mockUsers.length + 1,
      nomeFantasia: registerData.nomeFantasia,
      cnpj: cleanCNPJ,
      cidade: registerData.cidade,
      whatsapp: registerData.whatsapp,
      email: registerData.email,
      senha: registerData.senha,
      plano: 'gratuito',
      visualizacoes: 0
    }

    mockUsers.push(newUser)
    setUser(newUser)
    setIsLoggedIn(true)
    setCurrentView('home')
    setRegisterData({
      nomeFantasia: '',
      cnpj: '',
      cidade: '',
      whatsapp: '',
      email: '',
      senha: '',
      confirmarSenha: ''
    })
    setAuthError('')
  }

  const handleAddVehicle = () => {
    if (user.plano === 'gratuito') {
      alert('Upgrade para o plano Premium para cadastrar veículos!')
      return
    }
    
    const vehicle = {
      id: vehicles.length + 1,
      ...newVehicle,
      ano: parseInt(newVehicle.ano),
      km: parseInt(newVehicle.km),
      preco: parseInt(newVehicle.preco),
      fotos: [newVehicle.fotos || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop'],
      loja: user.nomeFantasia,
      cidade: user.cidade,
      whatsapp: user.whatsapp,
      cnpj: user.cnpj
    }
    
    setVehicles([...vehicles, vehicle])
    setNewVehicle({ marca: '', modelo: '', ano: '', km: '', preco: '', descricao: '', fotos: '' })
    setCurrentView('home')
  }

  const handleViewVehicle = (vehicle) => {
    if (user.plano === 'gratuito' && user.visualizacoes >= 5) {
      alert('Limite de visualizações atingido! Upgrade para o plano Premium.')
      return
    }
    
    if (user.plano === 'gratuito') {
      const updatedUser = {...user, visualizacoes: user.visualizacoes + 1}
      setUser(updatedUser)
      // Atualizar também no array mockUsers
      const userIndex = mockUsers.findIndex(u => u.id === user.id)
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser
      }
    }
    
    setSelectedVehicle(vehicle)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatCNPJ = (cnpj) => {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }

  // Login/Register Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#1A1A1A] border-[#333333]">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Car className="h-8 w-8 text-[#FFD700]" />
              <div>
                <h1 className="text-2xl font-bold text-white">RepassePro</h1>
                <p className="text-sm text-[#FFD700]">Conexão de Lojistas</p>
              </div>
            </div>
            <p className="text-[#CCCCCC]">Exclusivo para CNPJs do Tocantins</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Toggle Login/Register */}
            <div className="flex bg-[#2A2A2A] rounded-lg p-1">
              <Button
                variant={authMode === 'login' ? 'default' : 'ghost'}
                onClick={() => {
                  setAuthMode('login')
                  setAuthError('')
                }}
                className={`flex-1 ${authMode === 'login' ? 'bg-[#FFD700] text-black' : 'text-white hover:bg-[#333333]'}`}
              >
                Entrar
              </Button>
              <Button
                variant={authMode === 'register' ? 'default' : 'ghost'}
                onClick={() => {
                  setAuthMode('register')
                  setAuthError('')
                }}
                className={`flex-1 ${authMode === 'register' ? 'bg-[#FFD700] text-black' : 'text-white hover:bg-[#333333]'}`}
              >
                Cadastrar
              </Button>
            </div>

            {authError && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                <p className="text-red-400 text-sm">{authError}</p>
              </div>
            )}

            {/* Login Form */}
            {authMode === 'login' && (
              <>
                <div>
                  <Label htmlFor="login-cnpj" className="text-white">CNPJ</Label>
                  <Input
                    id="login-cnpj"
                    placeholder="00.000.000/0000-00"
                    value={loginData.cnpj}
                    onChange={(e) => setLoginData({...loginData, cnpj: formatCNPJInput(e.target.value)})}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                    maxLength={18}
                  />
                </div>
                <div>
                  <Label htmlFor="login-senha" className="text-white">Senha</Label>
                  <Input
                    id="login-senha"
                    type="password"
                    placeholder="Sua senha"
                    value={loginData.senha}
                    onChange={(e) => setLoginData({...loginData, senha: e.target.value})}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                  />
                </div>
                <Button 
                  onClick={handleLogin}
                  className="w-full bg-[#FFD700] text-black hover:bg-[#E6C200] font-semibold"
                >
                  Entrar
                </Button>
                <div className="text-center text-sm text-[#CCCCCC]">
                  <p>Usuário teste: CNPJ 12.345.678/0001-90, Senha: 123456</p>
                </div>
              </>
            )}

            {/* Register Form */}
            {authMode === 'register' && (
              <>
                <div>
                  <Label htmlFor="register-nome" className="text-white">Nome Fantasia</Label>
                  <Input
                    id="register-nome"
                    placeholder="Nome da sua loja"
                    value={registerData.nomeFantasia}
                    onChange={(e) => setRegisterData({...registerData, nomeFantasia: e.target.value})}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="register-cnpj" className="text-white">CNPJ</Label>
                  <Input
                    id="register-cnpj"
                    placeholder="00.000.000/0000-00"
                    value={registerData.cnpj}
                    onChange={(e) => setRegisterData({...registerData, cnpj: formatCNPJInput(e.target.value)})}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                    maxLength={18}
                  />
                </div>
                <div>
                  <Label htmlFor="register-cidade" className="text-white">Cidade</Label>
                  <Select value={registerData.cidade} onValueChange={(value) => setRegisterData({...registerData, cidade: value})}>
                    <SelectTrigger className="bg-[#2A2A2A] border-[#444444] text-white">
                      <SelectValue placeholder="Selecione sua cidade" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2A2A] border-[#444444]">
                      {cidades.map(cidade => (
                        <SelectItem key={cidade} value={cidade} className="text-white">{cidade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="register-whatsapp" className="text-white">WhatsApp</Label>
                  <Input
                    id="register-whatsapp"
                    placeholder="63999887766"
                    value={registerData.whatsapp}
                    onChange={(e) => setRegisterData({...registerData, whatsapp: e.target.value.replace(/[^\d]/g, '')})}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                    maxLength={11}
                  />
                </div>
                <div>
                  <Label htmlFor="register-email" className="text-white">E-mail</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="contato@suaempresa.com.br"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="register-senha" className="text-white">Senha</Label>
                  <Input
                    id="register-senha"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={registerData.senha}
                    onChange={(e) => setRegisterData({...registerData, senha: e.target.value})}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="register-confirmar" className="text-white">Confirmar Senha</Label>
                  <Input
                    id="register-confirmar"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={registerData.confirmarSenha}
                    onChange={(e) => setRegisterData({...registerData, confirmarSenha: e.target.value})}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                  />
                </div>
                <Button 
                  onClick={handleRegister}
                  className="w-full bg-[#FFD700] text-black hover:bg-[#E6C200] font-semibold"
                >
                  Cadastrar
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      {/* Header */}
      <header className="bg-[#1A1A1A] border-b border-[#333333] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="h-8 w-8 text-[#FFD700]" />
              <div>
                <h1 className="text-xl font-bold">RepassePro</h1>
                <p className="text-xs text-[#FFD700]">Conexão de Lojistas</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Button
                variant={currentView === 'home' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('home')}
                className={currentView === 'home' ? 'bg-[#FFD700] text-black' : 'text-white hover:text-[#FFD700]'}
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              <Button
                variant={currentView === 'add' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('add')}
                className={currentView === 'add' ? 'bg-[#FFD700] text-black' : 'text-white hover:text-[#FFD700]'}
              >
                <Plus className="h-4 w-4 mr-2" />
                Anunciar
              </Button>
              <Button
                variant={currentView === 'profile' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('profile')}
                className={currentView === 'profile' ? 'bg-[#FFD700] text-black' : 'text-white hover:text-[#FFD700]'}
              >
                <User className="h-4 w-4 mr-2" />
                Perfil
              </Button>
              <Button
                variant={currentView === 'admin' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('admin')}
                className={currentView === 'admin' ? 'bg-[#FFD700] text-black' : 'text-white hover:text-[#FFD700]'}
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </nav>

            {/* User Info & Mobile Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <Badge variant={user.plano === 'premium' ? 'default' : 'secondary'} className={user.plano === 'premium' ? 'bg-[#FFD700] text-black' : 'bg-[#333333] text-white'}>
                  {user.plano === 'premium' ? <Crown className="h-3 w-3 mr-1" /> : null}
                  {user.plano === 'premium' ? 'Premium' : 'Gratuito'}
                </Badge>
                <span className="text-sm text-[#CCCCCC]">{user.nomeFantasia}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsLoggedIn(false)
                  setUser(null)
                  setCurrentView('home')
                }}
                className="text-white hover:text-[#FFD700]"
              >
                <LogOut className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden text-white"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pb-4 border-t border-[#333333] pt-4">
              <div className="flex flex-col gap-2">
                <Button
                  variant={currentView === 'home' ? 'default' : 'ghost'}
                  onClick={() => { setCurrentView('home'); setShowMobileMenu(false) }}
                  className={`justify-start ${currentView === 'home' ? 'bg-[#FFD700] text-black' : 'text-white'}`}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
                <Button
                  variant={currentView === 'add' ? 'default' : 'ghost'}
                  onClick={() => { setCurrentView('add'); setShowMobileMenu(false) }}
                  className={`justify-start ${currentView === 'add' ? 'bg-[#FFD700] text-black' : 'text-white'}`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Anunciar
                </Button>
                <Button
                  variant={currentView === 'profile' ? 'default' : 'ghost'}
                  onClick={() => { setCurrentView('profile'); setShowMobileMenu(false) }}
                  className={`justify-start ${currentView === 'profile' ? 'bg-[#FFD700] text-black' : 'text-white'}`}
                >
                  <User className="h-4 w-4 mr-2" />
                  Perfil
                </Button>
                <Button
                  variant={currentView === 'admin' ? 'default' : 'ghost'}
                  onClick={() => { setCurrentView('admin'); setShowMobileMenu(false) }}
                  className={`justify-start ${currentView === 'admin' ? 'bg-[#FFD700] text-black' : 'text-white'}`}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#333333]">
                  <Badge variant={user.plano === 'premium' ? 'default' : 'secondary'} className={user.plano === 'premium' ? 'bg-[#FFD700] text-black' : 'bg-[#333333] text-white'}>
                    {user.plano === 'premium' ? <Crown className="h-3 w-3 mr-1" /> : null}
                    {user.plano === 'premium' ? 'Premium' : 'Gratuito'}
                  </Badge>
                  <span className="text-sm text-[#CCCCCC]">{user.nomeFantasia}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Home/Search View */}
        {currentView === 'home' && (
          <div className="space-y-6">
            {/* Search Filters */}
            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Filter className="h-5 w-5 text-[#FFD700]" />
                  Filtros de Busca
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <Select value={searchFilters.marca} onValueChange={(value) => setSearchFilters({...searchFilters, marca: value})}>
                    <SelectTrigger className="bg-[#2A2A2A] border-[#444444] text-white">
                      <SelectValue placeholder="Marca" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2A2A] border-[#444444]">
                      <SelectItem value="todas" className="text-white">Todas as marcas</SelectItem>
                      {marcas.map(marca => (
                        <SelectItem key={marca} value={marca} className="text-white">{marca}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Preço mín."
                    type="number"
                    value={searchFilters.precoMin}
                    onChange={(e) => setSearchFilters({...searchFilters, precoMin: e.target.value})}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                  />
                  
                  <Input
                    placeholder="Preço máx."
                    type="number"
                    value={searchFilters.precoMax}
                    onChange={(e) => setSearchFilters({...searchFilters, precoMax: e.target.value})}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                  />
                  
                  <Input
                    placeholder="Ano mín."
                    type="number"
                    value={searchFilters.anoMin}
                    onChange={(e) => setSearchFilters({...searchFilters, anoMin: e.target.value})}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                  />
                  
                  <Input
                    placeholder="Ano máx."
                    type="number"
                    value={searchFilters.anoMax}
                    onChange={(e) => setSearchFilters({...searchFilters, anoMax: e.target.value})}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                  />
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-[#CCCCCC]">
                    {filteredVehicles.length} veículo(s) encontrado(s)
                  </p>
                  {user.plano === 'gratuito' && (
                    <p className="text-[#FFD700] text-sm">
                      Visualizações restantes: {5 - user.visualizacoes}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map(vehicle => (
                <Card key={vehicle.id} className="bg-[#1A1A1A] border-[#333333] hover:border-[#FFD700] transition-colors">
                  <div className="relative">
                    <img
                      src={vehicle.fotos[0]}
                      alt={`${vehicle.marca} ${vehicle.modelo}`}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-2 right-2 bg-[#FFD700] text-black">
                      {vehicle.ano}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {vehicle.marca} {vehicle.modelo}
                    </h3>
                    <div className="space-y-2 text-sm text-[#CCCCCC]">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#FFD700]" />
                        <span>{vehicle.ano}</span>
                        <Gauge className="h-4 w-4 text-[#FFD700] ml-2" />
                        <span>{vehicle.km.toLocaleString()} km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#FFD700]" />
                        <span>{vehicle.cidade}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-[#FFD700]" />
                        <span>{vehicle.loja}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-bold text-[#FFD700]">
                        {formatPrice(vehicle.preco)}
                      </span>
                      <Button
                        onClick={() => handleViewVehicle(vehicle)}
                        size="sm"
                        className="bg-[#FFD700] text-black hover:bg-[#E6C200]"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Add Vehicle View */}
        {currentView === 'add' && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Plus className="h-5 w-5 text-[#FFD700]" />
                  Cadastrar Veículo
                </CardTitle>
                {user.plano === 'gratuito' && (
                  <p className="text-[#FFD700] text-sm">
                    Upgrade para Premium para cadastrar veículos ilimitados!
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="marca" className="text-white">Marca</Label>
                    <Select value={newVehicle.marca} onValueChange={(value) => setNewVehicle({...newVehicle, marca: value})}>
                      <SelectTrigger className="bg-[#2A2A2A] border-[#444444] text-white">
                        <SelectValue placeholder="Selecione a marca" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#2A2A2A] border-[#444444]">
                        {marcas.map(marca => (
                          <SelectItem key={marca} value={marca} className="text-white">{marca}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="modelo" className="text-white">Modelo</Label>
                    <Input
                      id="modelo"
                      value={newVehicle.modelo}
                      onChange={(e) => setNewVehicle({...newVehicle, modelo: e.target.value})}
                      className="bg-[#2A2A2A] border-[#444444] text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="ano" className="text-white">Ano</Label>
                    <Input
                      id="ano"
                      type="number"
                      value={newVehicle.ano}
                      onChange={(e) => setNewVehicle({...newVehicle, ano: e.target.value})}
                      className="bg-[#2A2A2A] border-[#444444] text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="km" className="text-white">Quilometragem</Label>
                    <Input
                      id="km"
                      type="number"
                      value={newVehicle.km}
                      onChange={(e) => setNewVehicle({...newVehicle, km: e.target.value})}
                      className="bg-[#2A2A2A] border-[#444444] text-white"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="preco" className="text-white">Preço (R$)</Label>
                    <Input
                      id="preco"
                      type="number"
                      value={newVehicle.preco}
                      onChange={(e) => setNewVehicle({...newVehicle, preco: e.target.value})}
                      className="bg-[#2A2A2A] border-[#444444] text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="descricao" className="text-white">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={newVehicle.descricao}
                    onChange={(e) => setNewVehicle({...newVehicle, descricao: e.target.value})}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="fotos" className="text-white">URL da Foto</Label>
                  <Input
                    id="fotos"
                    value={newVehicle.fotos}
                    onChange={(e) => setNewVehicle({...newVehicle, fotos: e.target.value})}
                    placeholder="https://exemplo.com/foto.jpg"
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                  />
                </div>
                
                <Button
                  onClick={handleAddVehicle}
                  className="w-full bg-[#FFD700] text-black hover:bg-[#E6C200] font-semibold"
                  disabled={user.plano === 'gratuito'}
                >
                  Cadastrar Veículo
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile View */}
        {currentView === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile Info */}
            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5 text-[#FFD700]" />
                  Informações da Loja
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Nome Fantasia</Label>
                  <Input
                    value={user.nomeFantasia}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-white">CNPJ</Label>
                  <Input
                    value={formatCNPJ(user.cnpj)}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-white">Cidade</Label>
                  <Input
                    value={user.cidade}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-white">WhatsApp</Label>
                  <Input
                    value={user.whatsapp}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-white">E-mail</Label>
                  <Input
                    value={user.email}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                    readOnly
                  />
                </div>
              </CardContent>
            </Card>

            {/* Subscription Plan */}
            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Crown className="h-5 w-5 text-[#FFD700]" />
                  Plano de Assinatura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Free Plan */}
                  <Card className={`${user.plano === 'gratuito' ? 'border-[#FFD700]' : 'border-[#444444]'} bg-[#2A2A2A]`}>
                    <CardHeader>
                      <CardTitle className="text-white">Gratuito</CardTitle>
                      <p className="text-2xl font-bold text-white">R$ 0<span className="text-sm">/mês</span></p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-[#CCCCCC]">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Visualizar até 5 anúncios/mês
                        </li>
                        <li className="flex items-center gap-2">
                          <X className="h-4 w-4 text-red-500" />
                          Cadastrar veículos
                        </li>
                        <li className="flex items-center gap-2">
                          <X className="h-4 w-4 text-red-500" />
                          Acesso a contatos
                        </li>
                      </ul>
                      {user.plano === 'gratuito' && (
                        <Badge className="mt-4 bg-[#333333] text-white">Plano Atual</Badge>
                      )}
                    </CardContent>
                  </Card>

                  {/* Premium Plan */}
                  <Card className={`${user.plano === 'premium' ? 'border-[#FFD700]' : 'border-[#444444]'} bg-[#2A2A2A]`}>
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Crown className="h-4 w-4 text-[#FFD700]" />
                        Premium
                      </CardTitle>
                      <p className="text-2xl font-bold text-[#FFD700]">R$ 59,90<span className="text-sm">/mês</span></p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-[#CCCCCC]">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Visualizações ilimitadas
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Cadastrar veículos ilimitado
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Acesso a contatos
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Notificações exclusivas
                        </li>
                      </ul>
                      {user.plano === 'premium' ? (
                        <Badge className="mt-4 bg-[#FFD700] text-black">Plano Atual</Badge>
                      ) : (
                        <Button className="mt-4 w-full bg-[#FFD700] text-black hover:bg-[#E6C200]">
                          Fazer Upgrade
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Admin View */}
        {currentView === 'admin' && (
          <div className="space-y-6">
            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings className="h-5 w-5 text-[#FFD700]" />
                  Painel Administrativo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="stats" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-[#2A2A2A]">
                    <TabsTrigger value="stats" className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">
                      Estatísticas
                    </TabsTrigger>
                    <TabsTrigger value="users" className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">
                      Usuários
                    </TabsTrigger>
                    <TabsTrigger value="vehicles" className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">
                      Veículos
                    </TabsTrigger>
                    <TabsTrigger value="subscriptions" className="text-white data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">
                      Assinaturas
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="stats" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="bg-[#2A2A2A] border-[#444444]">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-8 w-8 text-[#FFD700]" />
                            <div>
                              <p className="text-2xl font-bold text-white">1,247</p>
                              <p className="text-sm text-[#CCCCCC]">Usuários Ativos</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-[#2A2A2A] border-[#444444]">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Car className="h-8 w-8 text-[#FFD700]" />
                            <div>
                              <p className="text-2xl font-bold text-white">3,892</p>
                              <p className="text-sm text-[#CCCCCC]">Veículos Cadastrados</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-[#2A2A2A] border-[#444444]">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Crown className="h-8 w-8 text-[#FFD700]" />
                            <div>
                              <p className="text-2xl font-bold text-white">456</p>
                              <p className="text-sm text-[#CCCCCC]">Assinantes Premium</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-[#2A2A2A] border-[#444444]">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-8 w-8 text-[#FFD700]" />
                            <div>
                              <p className="text-2xl font-bold text-white">R$ 27.3k</p>
                              <p className="text-sm text-[#CCCCCC]">Receita Mensal</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="users" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">Usuários Cadastrados</h3>
                        <Button className="bg-[#FFD700] text-black hover:bg-[#E6C200]">
                          Exportar Lista
                        </Button>
                      </div>
                      
                      <Card className="bg-[#2A2A2A] border-[#444444]">
                        <CardContent className="p-0">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="border-b border-[#444444]">
                                <tr>
                                  <th className="text-left p-4 text-white">Nome Fantasia</th>
                                  <th className="text-left p-4 text-white">CNPJ</th>
                                  <th className="text-left p-4 text-white">Cidade</th>
                                  <th className="text-left p-4 text-white">Plano</th>
                                  <th className="text-left p-4 text-white">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {mockUsers.map(mockUser => (
                                  <tr key={mockUser.id} className="border-b border-[#444444]">
                                    <td className="p-4 text-[#CCCCCC]">{mockUser.nomeFantasia}</td>
                                    <td className="p-4 text-[#CCCCCC]">{formatCNPJ(mockUser.cnpj)}</td>
                                    <td className="p-4 text-[#CCCCCC]">{mockUser.cidade}</td>
                                    <td className="p-4">
                                      <Badge className={mockUser.plano === 'premium' ? 'bg-[#FFD700] text-black' : 'bg-[#333333] text-white'}>
                                        {mockUser.plano === 'premium' ? 'Premium' : 'Gratuito'}
                                      </Badge>
                                    </td>
                                    <td className="p-4">
                                      <Badge className="bg-green-600 text-white">Ativo</Badge>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="vehicles" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">Veículos Cadastrados</h3>
                        <Button className="bg-[#FFD700] text-black hover:bg-[#E6C200]">
                          Moderar Anúncios
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {vehicles.slice(0, 6).map(vehicle => (
                          <Card key={vehicle.id} className="bg-[#2A2A2A] border-[#444444]">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-white">{vehicle.marca} {vehicle.modelo}</h4>
                                <Badge className="bg-green-600 text-white">Aprovado</Badge>
                              </div>
                              <p className="text-sm text-[#CCCCCC]">Loja: {vehicle.loja}</p>
                              <p className="text-sm text-[#CCCCCC]">Preço: {formatPrice(vehicle.preco)}</p>
                              <div className="mt-2 flex gap-2">
                                <Button size="sm" variant="outline" className="border-[#444444] text-white hover:bg-[#333333]">
                                  Editar
                                </Button>
                                <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                                  Remover
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="subscriptions" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">Gestão de Assinaturas</h3>
                        <Button className="bg-[#FFD700] text-black hover:bg-[#E6C200]">
                          Relatório Financeiro
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-[#2A2A2A] border-[#444444]">
                          <CardHeader>
                            <CardTitle className="text-white">Resumo de Assinaturas</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-[#CCCCCC]">Usuários Gratuitos:</span>
                              <span className="text-white font-semibold">791</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#CCCCCC]">Usuários Premium:</span>
                              <span className="text-[#FFD700] font-semibold">456</span>
                            </div>
                            <Separator className="bg-[#444444]" />
                            <div className="flex justify-between">
                              <span className="text-[#CCCCCC]">Taxa de Conversão:</span>
                              <span className="text-green-500 font-semibold">36.6%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#CCCCCC]">Receita Mensal:</span>
                              <span className="text-[#FFD700] font-semibold">R$ 27.314,40</span>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-[#2A2A2A] border-[#444444]">
                          <CardHeader>
                            <CardTitle className="text-white">Ações Rápidas</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <Button className="w-full bg-[#FFD700] text-black hover:bg-[#E6C200]">
                              Enviar Promoção Premium
                            </Button>
                            <Button className="w-full" variant="outline">
                              Cancelar Assinaturas Vencidas
                            </Button>
                            <Button className="w-full" variant="outline">
                              Gerar Relatório de Pagamentos
                            </Button>
                            <Button className="w-full" variant="outline">
                              Configurar Preços
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Vehicle Detail Modal */}
      {selectedVehicle && (
        <Dialog open={!!selectedVehicle} onOpenChange={() => setSelectedVehicle(null)}>
          <DialogContent className="bg-[#1A1A1A] border-[#333333] text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {selectedVehicle.marca} {selectedVehicle.modelo} - {selectedVehicle.ano}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <img
                src={selectedVehicle.fotos[0]}
                alt={`${selectedVehicle.marca} ${selectedVehicle.modelo}`}
                className="w-full h-64 object-cover rounded-lg"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#FFD700]" />
                    <span className="text-[#CCCCCC]">Ano: {selectedVehicle.ano}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-[#FFD700]" />
                    <span className="text-[#CCCCCC]">KM: {selectedVehicle.km.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#FFD700]" />
                    <span className="text-[#CCCCCC]">Cidade: {selectedVehicle.cidade}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-[#FFD700]" />
                    <span className="text-[#CCCCCC]">Loja: {selectedVehicle.loja}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#FFD700]" />
                    <span className="text-[#CCCCCC]">CNPJ: {formatCNPJ(selectedVehicle.cnpj)}</span>
                  </div>
                  <div className="text-2xl font-bold text-[#FFD700]">
                    {formatPrice(selectedVehicle.preco)}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Descrição:</h4>
                <p className="text-[#CCCCCC]">{selectedVehicle.descricao}</p>
              </div>
              
              {user.plano === 'premium' && (
                <div className="flex gap-4">
                  <Button
                    onClick={() => window.open(`https://wa.me/55${selectedVehicle.whatsapp}?text=Olá! Tenho interesse no ${selectedVehicle.marca} ${selectedVehicle.modelo} ${selectedVehicle.ano} anunciado no RepassePro.`, '_blank')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={() => window.open(`tel:${selectedVehicle.whatsapp}`, '_blank')}
                    className="flex-1 bg-[#FFD700] text-black hover:bg-[#E6C200]"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Ligar
                  </Button>
                </div>
              )}
              
              {user.plano === 'gratuito' && (
                <div className="text-center p-4 bg-[#2A2A2A] rounded-lg">
                  <p className="text-[#FFD700] mb-2">Upgrade para Premium para acessar os contatos!</p>
                  <Button className="bg-[#FFD700] text-black hover:bg-[#E6C200]">
                    <Crown className="h-4 w-4 mr-2" />
                    Fazer Upgrade
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Footer */}
      <footer className="bg-[#1A1A1A] border-t border-[#333333] mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Car className="h-6 w-6 text-[#FFD700]" />
              <div>
                <p className="font-semibold text-white">RepassePro - Conexão de Lojistas</p>
                <p className="text-sm text-[#CCCCCC]">Exclusivo para CNPJs do Tocantins</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-[#CCCCCC]">
                Desenvolvido por <span className="text-[#FFD700]">Lucas Cavalcante</span>
              </p>
              <p className="text-xs text-[#888888]">© 2024 RepassePro. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}