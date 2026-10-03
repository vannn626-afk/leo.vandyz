import React from 'react';
export default class ToolErrorBoundary extends React.Component{
  constructor(props){super(props);this.state={error:null}}
  static getDerivedStateFromError(error){return {error}}
  componentDidCatch(error,info){try{sessionStorage.setItem('vandyz-tool-error',JSON.stringify({message:String(error?.message||error),stack:String(error?.stack||''),component:String(info?.componentStack||''),time:Date.now()}))}catch{} }
  render(){if(!this.state.error)return this.props.children;return <div className="error-box tool-crash-box"><b>Fitur mengalami error tampilan.</b><span>{String(this.state.error?.message||'Terjadi error pada fitur ini.')}</span><button onClick={()=>this.setState({error:null})}>COBA LAGI</button></div>}
}
