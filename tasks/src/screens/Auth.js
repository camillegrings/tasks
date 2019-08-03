import React, { Component } from 'react'
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native'
import axios from 'axios'
import { server, showError } from '../common'
import AuthInput from '../components/AuthInput'
import backgroundImage from '../../assets/imgs/login.jpg'
import commonStyles from '../commonStyles'

export default class Auth extends Component {
    state = {
        stageNew: false,
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    }

    signin = async () => {
        try {
            const res = await axios.post(`${server}/signin`, {
                email: this.state.email,
                password: this.state.password
            })
            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
            this.props.navigation.navigate('Home')
        } catch (error) {
            Alert.alert('Erro', 'Falha no Login!')
        }
    }

    signup = async () => {
        try {
            await axios.post(`${server}/signup`, {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            })
            Alert.alert('Sucesso!', 'Usuário Cadastrado :)')
            this.setState({ stageNew: false })
        } catch (error) {
            showError(error)
        }
    }

    signingOrSignup = async () => {
        if (this.state.stageNew) {
            this.signup()
        } else {
            this.signin()
        }
    }

    validations = () => {
        const validations = []
        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6) 
        if (this.state.stageNew) {
            validations.push(this.state.name && this.state.name.trim())
            validations.push(this.state.confirmPassword)
            validations.push(this.state.password === this.state.confirmPassword)
        }
        return validations
    }

    render () {
        const validForm = this.validations().reduce((all, v) => all & v)

        return (
            <ImageBackground source={backgroundImage} style={styles.background}>
                <Text style={styles.title}>Tasks</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>{this.state.stageNew ? 'Crie a sua conta' : 'Informe seus Dados'}</Text>
                    {this.state.stageNew && 
                        <AuthInput icon="user" placeholder="Nome" style={styles.input} value={this.state.name} 
                            onChangeText={name => this.setState({ name })} />}
                    <AuthInput icon="at" placeholder="E-mail" style={styles.input} value={this.state.email} 
                            onChangeText={email => this.setState({ email })} />
                    <AuthInput icon="lock" secureTextEntry={true} placeholder="Senha" style={styles.input} value={this.state.password} 
                            onChangeText={password => this.setState({ password })} />
                    {this.state.stageNew && 
                        <AuthInput icon="asterisk" secureTextEntry={true} placeholder="Confirmar Senha" style={styles.input} value={this.state.confirmPassword} 
                            onChangeText={confirmPassword => this.setState({ confirmPassword })} />}
                    <TouchableOpacity onPress={this.signingOrSignup} disabled={!validForm}>
                        <View style={[styles.button, !validForm ? {backgroundColor: '#AAA'} : {}]}>
                            <Text style={styles.buttonText}>{this.state.stageNew ? 'Registrar' : 'Entrar'}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ padding: 10 }} onPress={() => this.setState({ stageNew: !this.state.stageNew })}>
                        <Text style={styles.buttonText}>{this.state.stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}</Text>
                    </TouchableOpacity>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 70,
        marginBottom: 10
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20
    },
    formContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 20,
        width: '90%'
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF'
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center'
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20
    }
})