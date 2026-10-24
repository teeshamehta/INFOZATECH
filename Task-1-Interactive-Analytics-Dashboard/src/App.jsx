import { useMemo, useState } from 'react'
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, CalendarDays, ChartNoAxesCombined,
  ChevronDown, CircleDollarSign, Download, LayoutDashboard, Package, Search,
  ShoppingBag, Users, FileChartColumn, Menu, X, SlidersHorizontal, CheckCircle2,
  Clock3, XCircle, MoreHorizontal
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'

const weekly = [
  { label: 'Mon', revenue: 4200, orders: 86 },
  { label: 'Tue', revenue: 5100, orders: 102 },
  { label: 'Wed', revenue: 4600, orders: 94 },
  { label: 'Thu', revenue: 6200, orders: 124 },
  { label: 'Fri', revenue: 5700, orders: 113 },
  { label: 'Sat', revenue: 7900, orders: 157 },
  { label: 'Sun', revenue: 6800, orders: 138 },
]
const monthly = [
  { label: 'Week 1', revenue: 9200, orders: 235 },
  { label: 'Week 2', revenue: 11500, orders: 280 },
  { label: 'Week 3', revenue: 10200, orders: 251 },
  { label: 'Week 4', revenue: 13800, orders: 320 },
  { label: 'Week 5', revenue: 12400, orders: 296 },
  { label: 'Week 6', revenue: 15900, orders: 375 },
  { label: 'Week 7', revenue: 14200, orders: 340 },
  { label: 'Week 8', revenue: 18100, orders: 420 },
]
const quarterly = [
  { label: 'Jan', revenue: 35000, orders: 920 },
  { label: 'Feb', revenue: 39000, orders: 1020 },
  { label: 'Mar', revenue: 42000, orders: 1100 },
  { label: 'Apr', revenue: 38000, orders: 980 },
  { label: 'May', revenue: 51000, orders: 1320 },
  { label: 'Jun', revenue: 48000, orders: 1240 },
  { label: 'Jul', revenue: 55000, orders: 1410 },
  { label: 'Aug', revenue: 52000, orders: 1360 },
  { label: 'Sep', revenue: 61000, orders: 1550 },
  { label: 'Oct', revenue: 58000, orders: 1490 },
  { label: 'Nov', revenue: 69000, orders: 1720 },
  { label: 'Dec', revenue: 74000, orders: 1890 },
]
const orders = [
  { id: 'ORD-1048', product: 'Wireless Headphones', category: 'Electronics', date: 'Oct 10, 2026', amount: 2499, status: 'Completed', initials: 'WH', color: 'lavender' },
  { id: 'ORD-1047', product: 'Everyday Backpack', category: 'Accessories', date: 'Oct 10, 2026', amount: 1899, status: 'Pending', initials: 'EB', color: 'mint' },
  { id: 'ORD-1046', product: 'Smart Watch Pro', category: 'Electronics', date: 'Oct 09, 2026', amount: 5999, status: 'Completed', initials: 'SW', color: 'peach' },
  { id: 'ORD-1045', product: 'Classic Sneakers', category: 'Fashion', date: 'Oct 09, 2026', amount: 3299, status: 'Cancelled', initials: 'CS', color: 'pink' },
  { id: 'ORD-1044', product: 'Leather Wallet', category: 'Accessories', date: 'Oct 08, 2026', amount: 1299, status: 'Completed', initials: 'LW', color: 'blue' },
  { id: 'ORD-1043', product: 'Cotton T-shirt', category: 'Fashion', date: 'Oct 08, 2026', amount: 899, status: 'Completed', initials: 'CT', color: 'yellow' },
]
const categoryData = [
  { name: 'Electronics', value: 42, color: '#7778e8' },
  { name: 'Fashion', value: 27, color: '#40b99b' },
  { name: 'Accessories', value: 18, color: '#f2b65d' },
  { name: 'Home', value: 13, color: '#f18aa9' },
]
const money = (value) => '$' + Number(value).toLocaleString('en-US')
const CustomTooltip = ({ active, payload, label, kind = 'money' }) => {
  if (!active || !payload?.length) return null
  return <div className="chart-tooltip"><strong>{label}</strong><span>{kind === 'money' ? money(payload[0].value) : `${payload[0].value} orders`}</span></div>
}

function App() {
  const [period, setPeriod] = useState('30')
  const [category, setCategory] = useState('All categories')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState('Overview')
  const [mobileNav, setMobileNav] = useState(false)
  const [status, setStatus] = useState('All statuses')

  const chartData = period === '7' ? weekly : period === '90' ? quarterly.slice(0, 6) : period === '365' ? quarterly : monthly
  const factor = period === '7' ? 0.29 : period === '90' ? 2.8 : period === '365' ? 10.4 : 1
  const visibleOrders = useMemo(() => orders.filter((order) => {
    const matchesQuery = `${order.id} ${order.product} ${order.category} ${order.status}`.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'All categories' || order.category === category
    const matchesStatus = status === 'All statuses' || order.status === status
    return matchesQuery && matchesCategory && matchesStatus
  }), [query, category, status])

  const downloadCsv = () => {
    const header = ['Order ID', 'Product', 'Category', 'Date', 'Amount', 'Status']
    const rows = visibleOrders.map(o => [o.id, o.product, o.category, o.date, o.amount, o.status])
    const csv = [header, ...rows].map(row => row.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'insightboard-orders.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const metricCards = [
    { title: 'Total revenue', value: money(Math.round(48250 * factor)), change: '+12.8%', note: 'vs. previous period', icon: CircleDollarSign, tint: 'purple', up: true },
    { title: 'Total orders', value: Math.round(1248 * factor).toLocaleString(), change: '+8.2%', note: 'orders processed', icon: ShoppingBag, tint: 'green', up: true },
    { title: 'Customers', value: Math.round(846 * (period === '7' ? 0.3 : period === '90' ? 2.5 : period === '365' ? 8 : 1)).toLocaleString(), change: '+6.4%', note: 'unique customers', icon: Users, tint: 'orange', up: true },
    { title: 'Conversion rate', value: '3.6%', change: '+3.1%', note: 'visitors who purchased', icon: Activity, tint: 'pink', up: true },
  ]

  return (
    <div className="app-shell">
      {mobileNav && <button className="mobile-backdrop" aria-label="Close menu" onClick={() => setMobileNav(false)} />}
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><ChartNoAxesCombined size={23} /></div>
          <div><strong>InsightBoard</strong><small>ANALYTICS PLATFORM</small></div>
          <button className="icon-button mobile-close" aria-label="Close navigation" onClick={() => setMobileNav(false)}><X size={18}/></button>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="side-nav">
          <button className={page === 'Overview' ? 'nav-item active' : 'nav-item'} onClick={() => { setPage('Overview'); setMobileNav(false) }}><LayoutDashboard size={18}/>Overview</button>
          <button className={page === 'Reports' ? 'nav-item active' : 'nav-item'} onClick={() => { setPage('Reports'); setMobileNav(false) }}><FileChartColumn size={18}/>Reports<span className="nav-count">3</span></button>
        </nav>
        <div className="nav-label tools-label">TOOLS</div>
        <button className="nav-item" onClick={() => document.getElementById('orders-section')?.scrollIntoView({ behavior: 'smooth' })}><ShoppingBag size={18}/>Orders</button>
        <button className="nav-item" onClick={() => document.getElementById('category-section')?.scrollIntoView({ behavior: 'smooth' })}><SlidersHorizontal size={18}/>Categories</button>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><Activity size={18}/></div><strong>Need a hand?</strong><p>Explore your metrics and learn what drives growth.</p><button onClick={() => setPage('Reports')}>View reports <span>→</span></button></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button menu-toggle" aria-label="Open navigation" onClick={() => setMobileNav(true)}><Menu size={21}/></button>
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{page}</strong></div>
          <div className="topbar-actions">
            <div className="status-indicator"><span/> All systems operational</div>
            <button className="icon-button notification-button" aria-label="Notifications"><Bell size={19}/><i/></button>
          </div>
        </header>

        <div className="content">
          <section className="welcome-row">
            <div><div className="eyebrow"><span className="eyebrow-dot"/> BUSINESS INTELLIGENCE</div><h1>{page === 'Overview' ? 'Dashboard overview' : 'Analytics reports'}</h1><p>{page === 'Overview' ? "Here's what's happening with your business today." : 'Explore your business performance over time.'}</p></div>
            <div className="welcome-actions"><div className="date-pill"><CalendarDays size={16}/><span>{period === '7' ? 'Last 7 days' : period === '90' ? 'Last 90 days' : period === '365' ? 'This year' : 'Last 30 days'}</span><ChevronDown size={15}/><select aria-label="Select reporting period" value={period} onChange={e => setPeriod(e.target.value)}><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="365">This year</option></select></div><button className="export-button" onClick={downloadCsv}><Download size={16}/> Export CSV</button></div>
          </section>

          <section className="metrics-grid" aria-label="Key metrics">
            {metricCards.map(({ title, value, change, note, icon: Icon, tint, up }) => <article className="metric-card" key={title}><div className="metric-top"><div className={`metric-icon ${tint}`}><Icon size={20}/></div><span className="change-pill"><ArrowUpRight size={14}/>{change}</span></div><div className="metric-label">{title}</div><div className="metric-value">{value}</div><div className="metric-note"><span>{note}</span><span className="trend-line">↗</span></div></article>)}
          </section>

          <section className="charts-grid">
            <article className="panel revenue-panel">
              <div className="panel-heading"><div><h2>Revenue overview</h2><p>Sales performance over time</p></div><button className="dots-button" aria-label="More revenue options"><MoreHorizontal size={20}/></button></div>
              <div className="revenue-total"><strong>{money(Math.round(48250 * factor))}</strong><span className="positive"><ArrowUpRight size={15}/> 12.8%</span><span className="comparison">vs. previous period</span></div>
              <div className="chart-legend"><span className="legend-dot purple-dot"/> Revenue <span className="legend-caption">USD</span></div>
              <div className="revenue-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}><defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7778e8" stopOpacity={0.24}/><stop offset="95%" stopColor="#7778e8" stopOpacity={0.015}/></linearGradient></defs><CartesianGrid stroke="#edf0f6" strokeDasharray="4 5" vertical={false}/><XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#929bb0', fontSize: 11 }} dy={10}/><YAxis tickLine={false} axisLine={false} tick={{ fill: '#929bb0', fontSize: 11 }} tickFormatter={v => v >= 1000 ? `$${v / 1000}k` : `$${v}`} width={48}/><Tooltip content={<CustomTooltip/>}/><Area type="monotone" dataKey="revenue" stroke="#7778e8" strokeWidth={2.5} fill="url(#revenueFill)" activeDot={{ r: 5, strokeWidth: 0 }}/></AreaChart></ResponsiveContainer></div>
            </article>

            <article className="panel orders-panel">
              <div className="panel-heading"><div><h2>Orders & demand</h2><p>Order volume by period</p></div><button className="dots-button" aria-label="More orders options"><MoreHorizontal size={20}/></button></div>
              <div className="orders-summary"><div><strong>{Math.round(1248 * factor).toLocaleString()}</strong><span>Total orders</span></div><span className="change-pill"><ArrowUpRight size={14}/> 8.2%</span></div>
              <div className="bar-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ top: 12, right: 2, left: -22, bottom: 0 }}><CartesianGrid stroke="#edf0f6" strokeDasharray="4 5" vertical={false}/><XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#929bb0', fontSize: 10 }} dy={8}/><YAxis tickLine={false} axisLine={false} tick={{ fill: '#929bb0', fontSize: 10 }} width={40}/><Tooltip content={<CustomTooltip kind="orders"/>}/><Bar dataKey="orders" fill="#40b99b" radius={[5,5,0,0]} maxBarSize={28}/></BarChart></ResponsiveContainer></div>
              <div className="chart-footer"><span><i className="legend-dot green-dot"/> Completed orders</span><span>Updated just now</span></div>
            </article>
          </section>

          <section className="lower-grid">
            <article className="panel category-panel" id="category-section">
              <div className="panel-heading"><div><h2>Sales by category</h2><p>Revenue contribution</p></div><button className="dots-button" aria-label="More category options"><MoreHorizontal size={20}/></button></div>
              <div className="category-content"><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="62%" outerRadius="86%" paddingAngle={4} stroke="none">{categoryData.map(item => <Cell key={item.name} fill={item.color}/>)}</Pie><Tooltip formatter={value => `${value}%`}/></PieChart></ResponsiveContainer><div className="donut-center"><strong>100%</strong><span>Total sales</span></div></div><div className="category-legend">{categoryData.map(item => <div className="category-row" key={item.name}><span className="category-name"><i style={{ background: item.color }}/>{item.name}</span><strong>{item.value}%</strong></div>)}</div></div>
            </article>

            <article className="panel insight-panel">
              <div className="panel-heading"><div><h2>Performance insights</h2><p>A quick look at your growth</p></div><div className="insight-badge"><Activity size={16}/></div></div>
              <div className="insight-item"><div className="insight-icon green"><ArrowUpRight size={18}/></div><div><strong>Revenue is trending up</strong><p>Your revenue increased <b>12.8%</b> compared with the previous period.</p></div></div>
              <div className="insight-item"><div className="insight-icon purple"><Users size={18}/></div><div><strong>Customer growth is steady</strong><p>You welcomed more customers, with a <b>6.4%</b> increase this period.</p></div></div>
              <div className="insight-item"><div className="insight-icon orange"><ShoppingBag size={18}/></div><div><strong>Electronics leads sales</strong><p>Electronics makes up <b>42%</b> of your sample category revenue.</p></div></div>
            </article>
          </section>

          <section className="panel table-panel" id="orders-section">
            <div className="table-heading"><div><h2>Recent orders</h2><p>Monitor and search your latest transactions</p></div><button className="table-export" onClick={downloadCsv}><Download size={15}/> Export</button></div>
            <div className="table-filters"><div className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search orders, products..." aria-label="Search orders"/></div><label className="filter-select"><SlidersHorizontal size={15}/><select value={category} onChange={e => setCategory(e.target.value)} aria-label="Filter by category"><option>All categories</option><option>Electronics</option><option>Accessories</option><option>Fashion</option></select><ChevronDown size={14}/></label><label className="filter-select status-select"><select value={status} onChange={e => setStatus(e.target.value)} aria-label="Filter by status"><option>All statuses</option><option>Completed</option><option>Pending</option><option>Cancelled</option></select><ChevronDown size={14}/></label></div>
            <div className="table-scroll"><table><thead><tr><th>ORDER</th><th>PRODUCT</th><th>DATE</th><th>AMOUNT</th><th>STATUS</th><th></th></tr></thead><tbody>{visibleOrders.map(order => <tr key={order.id}><td className="order-id">{order.id}</td><td><div className="product-cell"><div className={`product-thumb ${order.color}`}>{order.initials}</div><div><strong>{order.product}</strong><span>{order.category}</span></div></div></td><td className="date-cell">{order.date}</td><td className="amount-cell">{money(order.amount)}</td><td><span className={`status-badge ${order.status.toLowerCase()}`}>{order.status === 'Completed' ? <CheckCircle2 size={13}/> : order.status === 'Pending' ? <Clock3 size={13}/> : <XCircle size={13}/>} {order.status}</span></td><td><button className="row-more" aria-label={`More options for ${order.id}`}><MoreHorizontal size={18}/></button></td></tr>)}</tbody></table>{visibleOrders.length === 0 && <div className="empty-state"><Search size={24}/><strong>No matching orders</strong><span>Try changing your search or filters.</span><button onClick={() => { setQuery(''); setCategory('All categories'); setStatus('All statuses') }}>Clear filters</button></div>}</div>
            <div className="table-bottom"><span>Showing <b>{visibleOrders.length}</b> of <b>{orders.length}</b> orders</span><div className="pagination"><button disabled>Previous</button><button className="current-page">1</button><button disabled>Next</button></div></div>
          </section>

          <footer className="footer"><span>© 2026 InsightBoard. Analytics made clearer.</span><span><i/> All data shown is sample data</span></footer>
        </div>
      </main>
    </div>
  )
}

export default App
