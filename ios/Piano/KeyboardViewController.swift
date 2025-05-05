//
//  KeyboardViewController.swift
//  Piano
//
//  Created by Evan Templeton on 5/2/25.
//

import UIKit
import class SwiftUI.UIHostingController

class KeyboardViewController: UIInputViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let controller = UIHostingController(rootView: ETPianoKeyboard())
        addChild(controller)
        guard let inputView else {
            return
        }
        controller.view.translatesAutoresizingMaskIntoConstraints = false
        inputView.addSubview(controller.view)
        controller.didMove(toParent: self)
        NSLayoutConstraint.activate([
            controller.view.topAnchor.constraint(equalTo: inputView.topAnchor),
            controller.view.bottomAnchor.constraint(equalTo: inputView.bottomAnchor),
            controller.view.leadingAnchor.constraint(equalTo: inputView.leadingAnchor),
            controller.view.trailingAnchor.constraint(equalTo: inputView.trailingAnchor)
        ])
    }
    
    override func textWillChange(_ textInput: UITextInput?) {
        // The app is about to change the document's contents. Perform any preparation here.
    }
    
    override func textDidChange(_ textInput: UITextInput?) {
        // The app has just changed the document's contents, the document context has been updated.
    }

}
