//
//  ETPianoKeyboard.swift
//  MusicSearch
//
//  Created by Evan Templeton on 5/2/25.
//

import SwiftUI
import PianoKeyboard

public protocol ETPianoKeyboardDelegate: AnyObject {
    func keysPressed(_ keys: [[String]])
}

public final class ETPianoKeyboardHostingController: UIHostingController<ETPianoKeyboard> {
    private weak var delegate: ETPianoKeyboardDelegate?
    
    @State private var keysPressed: [[String]] = []
    
    init(delegate: ETPianoKeyboardDelegate) {
        self.delegate = delegate
        super.init(rootView: ETPianoKeyboard(keysPressed: $keysPressed))
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

public struct ETPianoKeyboard: View {
    
    @State private var input = [String]()
    @Binding private var keysPressed: [[String]]
    
    public init(keysPressed: Binding<[[String]]>) {
        _keysPressed = keysPressed
    }
    
    public var body: some View {
        HStack {
            PianoInputField(keysPressed: $input)
                .frame(minHeight: 300)
                .onChange(of: input) { _, newValue in
                    if !newValue.isEmpty {
                        keysPressed.append(newValue)
                    }
                }
            self.backspaceButton
        }
        .ignoresSafeArea(edges: .horizontal)
    }
    
    private var backspaceButton: some View {
        Button {
            guard !keysPressed.isEmpty else {
                return
            }
            keysPressed.removeLast()
        } label: {
            Image(systemName: "delete.backward")
                .foregroundStyle(.gray)
                .frame(maxWidth: 40, maxHeight: .infinity)
                .background {
                    RoundedRectangle(cornerRadius: 4).stroke(.gray, lineWidth: 2)
                }
        }
    }
}

#Preview {
    ETPianoKeyboard(keysPressed: .constant([[]]))
}

public struct PianoInputField: View {
    @StateObject private var viewModel = PianoKeyboardViewModel()
    @Binding private var keysPressed: [String]
    
    public init(keysPressed: Binding<[String]>) {
        self._keysPressed = keysPressed
    }
    
    public var body: some View {
        PianoKeyboardView(viewModel: viewModel, style: ClassicStyle())
            .onChange(of: viewModel.keysPressed) { oldKeys, newKeys in
                if newKeys != oldKeys {
                    keysPressed = newKeys
                }
            }
    }
}

private extension PianoInputField {
    struct ExampleView: View {
        @State private var keysPressed: [String] = []
        var body: some View {
            VStack {
                Color.white
                HStack {
                    if !keysPressed.isEmpty {
                        ForEach(keysPressed, id: \.self) { key in
                            Text(key)
                        }
                    } else {
                        Text("Press a key...")
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal)
                PianoInputField(keysPressed: $keysPressed)
            }
        }
    }
}

//#Preview {
//    PianoInputField.ExampleView()
//}
